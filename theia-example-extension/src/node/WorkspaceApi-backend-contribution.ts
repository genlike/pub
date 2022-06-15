import { injectable } from 'inversify';
import * as express from 'express';
import { BackendApplicationContribution } from '@theia/core/lib/node';
// import { FileNavigatorWidget, FILE_NAVIGATOR_ID } from '@theia/navigator/lib/browser/navigator-widget';
// import { WorkspaceNode } from '@theia/navigator/lib/browser/navigator-tree';
// import URI from '@theia/core/lib/common/uri';


var path = "file:///C:/Users/ricar/Documents/Projectos/theia-example-extension/browser-app";



@injectable()
export class SwitchWSBackendContribution implements BackendApplicationContribution {
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
            // const widget = this.shell.getWidgetById(FILE_NAVIGATOR_ID) as FileNavigatorWidget | undefined;
            // if (!widget) {
            //     return;
            // }
            console.log('getWorkspace :' + path);
            // let uri = Uri.file('/some/path/to/folder');
            // let success = await commands.executeCommand('vscode.openFolder', uri);
            // if (WorkspaceNode.is(widget.model.root)) {
            //     widget.model.selectNode(widget.model.getNodesByUri(new URI(path)).next().value);
            // }
             res.send(path);
             res.end();
        });
    }
}