import { injectable } from 'inversify';
import * as express from 'express';
import { BackendApplicationContribution } from '@theia/core/lib/node';







//const pg = require('pg');
import * as fs from 'fs';
import * as uuid from 'uuid';
//var getDirName = require('path').dirname;
let requestIp = require('request-ip');
import * as chokidar from 'chokidar';
// import { FileNavigatorWidget, FILE_NAVIGATOR_ID } from '@theia/navigator/lib/browser/navigator-widget';
// import { WorkspaceNode } from '@theia/navigator/lib/browser/navigator-tree';
// import URI from '@theia/core/lib/common/uri';


var path = "file:///C:/Users/ricar/Documents/Projectos/theia-example-extension/browser-app";
let hostfs = "/home/theia/workspaces/"
var currentEditors: {[ip:string]: Editor} = {};


type Editor = {
    foldername:string;
    time:number;
    watcher: chokidar.FSWatcher;
};

@injectable()
export class SwitchWSBackendContribution implements BackendApplicationContribution {
    
    //@inject(DiskFileSystemProvider) private readonly fileChangeCollection: DiskFileSystemProvider;
    // @inject(ApplicationShell)
    // protected readonly shell: ApplicationShell;

    // constructor(
    //     @inject(ILogger) protected readonly logger: ILogger) {}

    

    configure(app: express.Application) {

        

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

      setInterval(() => {
        for (const [key, value] of Object.entries(currentEditors)) {
            console.log(key + value + 'Time Diff' + (Date.now() - value.time));
            //If last update was 5 min ago
            //let val:[any, any, any] = value
            if(Date.now() - value.time>5*1000*60){
                console.log("unwatch this" + value.foldername.substr(66));
                value.watcher.unwatch(value.foldername.substr(66));
                value.watcher.close().then(() => {
                
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
        }
      }
}, 60000);

function createWorkspace(ip:string){
    let randomFoldername =hostfs + 'tmp/WS-' + uuid.v4() + '/Workspace';
    //let randomFoldername = 'tmp/Workspace';
     fs.mkdir(randomFoldername, {recursive: true},(err:any) => {
         if (err) throw err;
     });
    currentEditors[ip] = {
        foldername: randomFoldername,
        time: Date.now(),
        watcher: createWatcher(randomFoldername)
     };
    //pullFilesFromDb(randomFoldername,3);
}


    function createWatcher(path:string){
        console.log('created watcher for:' + path);
        let watcher: chokidar.FSWatcher = chokidar.watch(path, { persistent: true});
        watcher
        .on('add', function(path:string) {
            console.log('File', path, 'has been added');
            //addFileToDb(path);
        })
        .on('change', function(path:string) {
            
            console.log('File', path, 'has been changed');
            //readFileToUpdate(path);
        })
        .on('unlink', function(path:string) {
            console.log('File', path, 'has been removed');
            //deleteFileFromDb(path);
        })
        .on('error', function(error:any) {console.error('Error happened', error);});
        return watcher;
    }




    }
}