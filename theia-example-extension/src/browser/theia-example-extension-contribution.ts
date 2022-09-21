
import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, MessageService} from '@theia/core/lib/common';
import {  FrontendApplication, AbstractViewContribution } from '@theia/core/lib/browser';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { WorkspaceService } from "@theia/workspace/lib/browser/workspace-service";
import { GettingStartedWidget } from './theia-example-extension-widget';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import * as monaco from '@theia/monaco-editor-core';


import { ILogger } from "@theia/core/lib/common";
import { ApplicationShell } from '@theia/core/lib/browser/shell/application-shell';
import  TheiaURI from '@theia/core/lib/common/uri';

import axios from 'axios';



var path = '/home/theia/Workspaces';
var itlingoCloudURL = "https://itlingocloud.herokuapp.com/";

export const TheiaExampleExtensionCommand: Command = {
    id: 'TheiaExampleExtension.command',
    label: 'Say Hello'
};


@injectable()
export class TheiaSendBdFileUpdates extends AbstractViewContribution<GettingStartedWidget>  implements FrontendApplicationContribution {

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;
    @inject(FrontendApplicationStateService)
    protected readonly stateService: FrontendApplicationStateService;

    constructor(
        @inject(WorkspaceService) private readonly workspaceService: WorkspaceService,
        // @inject(MonacoEditorService) private readonly monacoEditorService: MonacoEditorService,
        //@inject(MonacoWorkspace) private readonly monacoWorkspace: MonacoWorkspace,
        @inject(MessageService) private readonly messageService: MessageService,

       
        
        // @inject(WorkspaceCommandContribution) private readonly workspaceCommandContribution: WorkspaceCommandContribution,
        // @inject(CommandService) private readonly commandService: CommandService,
        //@inject(CommandService) private readonly commandService: CommandService,
        @inject(ILogger) protected readonly logger: ILogger
    ) { 
        super({
            widgetId: GettingStartedWidget.ID,
            widgetName: GettingStartedWidget.LABEL,
            defaultWidgetOptions: {
                area: 'main',
            }
        });
    }
    
    private readonly:boolean = true;
    protected async switchWorkspace(path: string): Promise<void> {
        this.messageService.info(path);
         this.workspaceService.open(new TheiaURI(path), {
            preserveWindow: true
         });
    }

    private setReadOnly(){
        monaco.editor.onDidCreateEditor((codeEditor) =>{
            codeEditor.updateOptions({readOnly: this.readonly});
        });
    }

     private compareFoldernames(path1: string, path2: string){
         return path1.substring(path1.length-77) === path2.substring(path2.length - 77);
     }
    configure(app: FrontendApplication): void{
        
    }
    onStart(app: FrontendApplication):void {
         axios.get<JSON>('/getWorkspace',{},).then(
                 (response: any) => {
                     var prevRoot = this.workspaceService.tryGetRoots()[0] ;
                     
                    if (prevRoot != undefined) {
                        if (!this.compareFoldernames(response.data.foldername.toString(), prevRoot.resource.path.toString())){
                            path = '' + response.data.foldername;
                            this.messageService.info("Changing Workspace to:" + response.data.foldername + " PREV:" + prevRoot.resource.path);
                            this.switchWorkspace(path);
                        }
                    } else {
                        path = '' + response.data.foldername;
                        this.messageService.info("Setting Workspace to:" + response.data.foldername + " STATUS:" + response.status);
                        this.switchWorkspace(path);
                    }
                    this.stateService.reachedState('ready').then(
                        () => this.openView({ reveal: true })
                    );
                    //console.log("SetREADONLY");
                    this.readonly = response.data.readonly;
                    console.log(this.readonly);
                    this.setReadOnly();
                 }
             ).catch((error) => {
                window.location.href = itlingoCloudURL;
             });

        //  setInterval(() =>
        //  {
        //      axios.get<String>('/ping',{},);
        // }, 60*1000);


        this.messageService.info("Welcome to ITLingo online IDE!");
    }
}

