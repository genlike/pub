import { injectable } from 'inversify';
import * as express from 'express';
import { BackendApplicationContribution } from '@theia/core/lib/node';

//const pg = require('pg');
import * as fs from 'fs';

import * as nsfw from 'nsfw'
import * as uuid from 'uuid';
const { Pool } = require('pg');
const getDirName = require('path').dirname
//var getDirName = require('path').dirname;
let requestIp = require('request-ip');

// import { FileNavigatorWidget, FILE_NAVIGATOR_ID } from '@theia/navigator/lib/browser/navigator-widget';
// import { WorkspaceNode } from '@theia/navigator/lib/browser/navigator-tree';
// import URI from '@theia/core/lib/common/uri';


var path = "file:///C:/Users/ricar/Documents/Projectos/theia-example-extension/browser-app";
let hostfs = "/home/theia/workspaces/"
var currentEditors: {[ip:string]: Editor} = {};


type Editor = {
    foldername:string;
    time:number;
    watcher: Promise<nsfw.NSFW>;
};

@injectable()
export class SwitchWSBackendContribution implements BackendApplicationContribution {
    
    //@inject(DiskFileSystemProvider) private readonly fileChangeCollection: DiskFileSystemProvider;
    // @inject(ApplicationShell)
    // protected readonly shell: ApplicationShell;

    // constructor(
    //     @inject(ILogger) protected readonly logger: ILogger) {}

    configure(app: express.Application) {

        // const client = new Client({
        //     host:'ec2-52-31-217-108.eu-west-1.compute.amazonawas.com',
            
        // });
        const connectionString = process.env.DATABASE_URL;
        console.log("CONSTRING - " + connectionString)

        const pgPool = new Pool({
            connectionString,
            // ssl: {
            //     rejectUnauthorized: false
            // }
            ssl: false
        });
        
        function pullFilesFromDb(destinationFolder: string, params: string[]) {
            console.log("PullFiles to:");
            console.log(destinationFolder);
            console.log(params[0]);
            const selectQuery = "SELECT filename, file FROM t_files WHERE workspace=$1";
            pgPool.query(selectQuery, [params[0]], (err:Error, res:any) => {
                console.log("SELECT")
                if (err) return;
                console.log(res); 
                res.rows.forEach((element:any) => {
                    fs.mkdirSync(getDirName(destinationFolder + '/' + element.filename), {recursive: true});
                    fs.writeFileSync(destinationFolder + '/' + element.filename, element.file);
                });
            });
        }


        async function addFileToDB(params:string[], event:nsfw.CreatedFileEvent){
            console.log("Add file");
            console.log(event.directory);
            console.log(event.file);
            const fullfilepath = event.directory + '/' + event.file;
            const onlyFile = fullfilepath.substring(77);

            const client = await pgPool.connect();
            await client.query("SELECT filename, workspace FROM t_files WHERE filename=$1 AND workspace=$2", [onlyFile,params[0]], (err:any, res:any) =>
            {
                if(err) {
                    console.error("AddFileToDB ERROR");
                    console.error(err.stack);
                    return;
                }
                if(res.rowCount > 0){
                    console.log("File Already Exists");
                } else {
                    var rawData = fs.readFileSync(fullfilepath);
                    console.log(params);
                    client.query("INSERT INTO t_files (filename, workspace, file) VALUES ($1, $2, $3)",
                    [onlyFile,params[0], rawData], (err:Error,resI:any) => {
                        if(err) {
                            console.error("AddFileToDB Insert ERROR");
                            console.error(err.stack);
                            return;
                        }
                        //console.log("Inserted " + resI.row[0]);
                    });
                }
            });
            client.release();
        }


       async function changeFileToDB(params: string[], event: nsfw.ModifiedFileEvent) {
            console.log("Change File");
            console.log(event.directory);
            console.log(event.file);


            const client = await pgPool.connect();
            try {
                const fullfilepath = event.directory + '/' + event.file;
                const onlyFile = fullfilepath.substring(77);
                var rawData = fs.readFileSync(fullfilepath);

                await client.query("BEGIN");
                const deleteQuery = "DELETE FROM t_files WHERE filename = $1 AND workspace = $2;"
                await client.query(deleteQuery,[onlyFile, params[0]]);

                const insertQuery = "INSERT INTO t_files(filename, workspace, file) VALUES ($1, $2, $3)"
                client.query(insertQuery, [onlyFile,params[0], rawData]);

                await client.query("COMMIT");
            } catch (e) {
                await client.query("ROLLBACK");
            } finally {
                client.release();
            }
        }

        function deleteFileToDB(params: string[], event: nsfw.DeletedFileEvent) {
            console.log("Delete File");
            console.log(event.directory);
            console.log(event.file);
            const fullfilepath = event.directory + '/' + event.file;
            const onlyFile = fullfilepath.substring(77);
            const deleteQuery = "DELETE FROM t_files WHERE filename = $1 AND workspace = $2;"
            pgPool.query(deleteQuery,[onlyFile, params[0]]);
        }

        function renameFileToDB(params: string[], event: nsfw.RenamedFileEvent) {
            console.log("Rename File");
            console.log(event.directory);
            console.log(event.oldFile);

            console.log(event.newDirectory);
            console.log(event.newFile);

            const fullfilepath = event.directory + '/' + event.oldFile;
            const newfullfilepath = event.newDirectory + '/' + event.newFile;
            const oldFile = fullfilepath.substring(77);
            const newFile = newfullfilepath.substring(77);

            const updateQuery = "UPDATE t_files SET filename=$1 WHERE filename=$2 AND workspace=$3";
            pgPool.query(updateQuery, [newFile, oldFile, params[0]]);
        }

        app.post('/setWorkspace', (req, res) => {
            // const widget = this.shell.getWidgetById(FILE_NAVIGATOR_ID) as FileNavigatorWidget | undefined;
            // if (!widget) {
            //     return;
            // }
            
            path = req.body.path;
            path = path.replace("\\", "/");
            console.log('setWorkspace :' + path);
            // let uri = Uri.file('/some/path/to/folder');
            // let success = await commands.executeCommand('vscode.openFolder', uri);
            // if (WorkspaceNode.is(widget.model.root)) {
            //     widget.model.selectNode(widget.model.getNodesByUri(new URI(path)).next().value);
            // }
             res.send("done!");
             res.end();
        });

        app.get('/getWorkspace', (req, res) => {
            let ip = requestIp.getClientIp(req);
            console.log(currentEditors);
            console.log(ip);
            if(!(ip in currentEditors)){
                createWorkspace(ip, ['workspace']);
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.send(currentEditors[ip].foldername);
            res.end();
        });

        app.get('/createTempWorkspace', (req, res) => {
            let ip = requestIp.getClientIp(req);
            var params = ['workspace'];
            if (req.query.ws) params = [req.query.ws.toString()];
            if (req.query.user) params = params.concat( [req.query.user.toString()]);
            if (req.query.cp) params = params.concat( [req.query.cp.toString()]);
            createWorkspace(ip, params);
            res.statusCode = 301;
            res.redirect('/');
            res.end();
        
        });

        app.get('/ping', (req, res) => {
            let ip = requestIp.getClientIp(req);
            if(currentEditors[ip]) currentEditors[ip].time =  Date.now();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.send("detected workspace of" + ip);
            res.end();
        
        });


function createWorkspace(ip:string, params:string[]){
    var randomFoldername = hostfs + 'tmp/WS-' + uuid.v4() + '/Workspace-'+ params[0];
    //let randomFoldername = 'tmp/Workspace';

     fs.mkdir(randomFoldername, {recursive: true},(err:any) => {
         if (err) throw err;
         currentEditors[ip] = {
            foldername: randomFoldername,
            time: Date.now(),
            watcher: createWatcher(randomFoldername,params)
         };
     });
    pullFilesFromDb(randomFoldername,params);
}


    async function  createWatcher(path:string, params:string[]){

        let watcher: nsfw.NSFW | undefined = await nsfw(fs.realpathSync(path), (events: nsfw.FileChangeEvent[]) => {
            for (const event of events) {
                if (event.action === nsfw.actions.CREATED) {
                    console.log('File', path, 'has been added');
                    addFileToDB(params, event);
                }
                if (event.action === nsfw.actions.DELETED) {
                    console.log('File', path, 'has been removed');
                    deleteFileToDB(params, event);
                }
                if (event.action === nsfw.actions.MODIFIED) {
                    console.log('File', path, 'has been changed');
                    changeFileToDB(params, event);
                }
                if (event.action === nsfw.actions.RENAMED) {
                    console.log('File', path, 'has been changed');
                    renameFileToDB(params, event);
                }
            }
        }, {
                errorCallback: error => {
                    // see https://github.com/atom/github/issues/342
                    console.warn(`Failed to watch "${path}":`, error);
                }
            });
        console.log('created watcher for:' + path);
        await watcher.start();
        return watcher;
    }

    
    setInterval(() => {
        for (const [key, value] of Object.entries(currentEditors)) {
            console.log(key + value + 'Time Diff' + (Date.now() - value.time));
            //If last update was 5 min ago
            //let val:[any, any, any] = value
            if(Date.now() - value.time>5*1000*60){
                console.log("unwatch this" + value.foldername.substr(66));
                //value.watcher.unwatch(value.foldername.substr(66));
                value.watcher.then((val) => {val.stop().then(() => {
                    delete currentEditors[key];
                    fs.readdir(value.foldername.substr(66), (error:any, files:string[])=> {
                        if(error){
                            console.log(error);
                        } else {
                            files.forEach(file => {
                                console.log(file);
                            });
                        }
                    });
                    fs.rmdir(value.foldername.substr(66)+'/..',{recursive: true}, (error:any) => {console.log(error)});
                });
            });
        }
      }
}, 60000);

     


    }
}








