import { injectable } from 'inversify';
import * as express from 'express';
import { BackendApplicationContribution } from '@theia/core/lib/node';

//const pg = require('pg');
import * as fs from 'fs';
import * as nsfw from 'nsfw'
import * as uuid from 'uuid';
const { Client } = require('pg');
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
        const connectionString = "postgres://postgres:postgres@172.28.192.1:5432/itlingo"; //process.env.DATABASE_URL;
        console.log("CONSTRING - " + connectionString)

        const pgClient = new Client({
            connectionString,
            ssl: false
        });
        pgClient.connect();

        function addFileToDB(params:string[], event:nsfw.CreatedFileEvent){
            console.log("Add file");
            console.log(event.directory);
            console.log(event.file);
            pgClient.query("SELECT filename, workspace FROM t_files WHERE filename=$1 AND workspace=$2", [event.file,params[0]], (err:any, res:any) =>
            {
                if(err) {
                    console.error("AddFileToDB ERROR");
                    console.error(err.stack);
                    return;
                }
                console.log("QUERY");
                if(res.rowCount > 0){
                    console.log("File Already Exists");
                } else {
                    const fullfilepath = event.directory + '/' + event.file;

                    var rawData = fs.readFileSync(fullfilepath);
                    pgClient.query("INSERT INTO t_files(filename, workspace, file) VALUES ($1, $2, $3)",
                    [fullfilepath.substring(76),params[0], rawData], (err:any,res:any) => {
                        if(err) {
                            console.error("AddFileToDB Insert ERROR");
                            console.error(err.stack);
                            return;
                        }
                        console.log("Inserted " + res.row[0]);
                    });
                }
            });
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
                createWorkspace(ip);
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.send(currentEditors[ip].foldername);
            res.end();
        });

        app.get('/createTempWorkspace', (req, res) => {
            let ip = requestIp.getClientIp(req);
        
            createWorkspace(ip);
            res.statusCode = 301;
            res.redirect('/');
            res.end();
        
        });

        app.get('/ping', (req, res) => {
            let ip = requestIp.getClientIp(req);
            //console.log("PING FROM");
            if(currentEditors[ip]) currentEditors[ip].time =  Date.now();
            //console.log(currentEditors);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.send("detected workspace of" + ip);
            res.end();
        
        });


function createWorkspace(ip:string){
    let randomFoldername =hostfs + 'tmp/WS-' + uuid.v4() + '/Workspace';
    //let randomFoldername = 'tmp/Workspace';
     fs.mkdir(randomFoldername, {recursive: true},(err:any) => {
         if (err) throw err;
         var params = ['workspace'];
         currentEditors[ip] = {
            foldername: randomFoldername,
            time: Date.now(),
            watcher: createWatcher(randomFoldername,params)
         };
     });
    //pullFilesFromDb(randomFoldername,3);
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
                }
                if (event.action === nsfw.actions.MODIFIED) {
                    console.log('File', path, 'has been changed');
                }
                if (event.action === nsfw.actions.RENAMED) {
                    console.log('File', path, 'has been changed');
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