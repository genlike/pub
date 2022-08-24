
import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService} from '@theia/core/lib/common';
import { CommonMenus, FrontendApplication } from '@theia/core/lib/browser';
import { LanguageGrammarDefinitionContribution, TextmateRegistry} from "@theia/monaco/lib/browser/textmate";
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { MonacoWorkspace } from '@theia/monaco/lib/browser/monaco-workspace';
import { MonacoEditorService } from '@theia/monaco/lib/browser/monaco-editor-service';
import { WorkspaceService } from "@theia/workspace/lib/browser/workspace-service";
// import { WorkspaceCommandContribution } from "@theia/workspace/lib/browser/workspace-commands";
//import { WorkspaceCommands } from "@theia/workspace/lib/browser/workspace-commands";



import { ILogger } from "@theia/core/lib/common";
import { ApplicationShell } from '@theia/core/lib/browser/shell/application-shell';
//import URI from '@theia/core/lib/common/uri';
import TheiaURI from '@theia/core/lib/common/uri';
import { languages } from '@theia/monaco-editor-core';



//import { FileChangeCollection } from '@theia/filesystem/src/node/file-change-collection';
import axios from 'axios';



var path = '/home/theia/Workspaces';
//var remoteHostIp = '192.168.1.120';
var itlingoCloudURL = 'http://localhost:8000/'

export const TheiaExampleExtensionCommand: Command = {
    id: 'TheiaExampleExtension.command',
    label: 'Say Hello'
};


@injectable()
export class TheiaSendBdFileUpdates implements FrontendApplicationContribution {

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;
    constructor(
        @inject(WorkspaceService) private readonly workspaceService: WorkspaceService,
        @inject(MonacoEditorService) private readonly monacoEditorService: MonacoEditorService,
        @inject(MonacoWorkspace) private readonly monacoWorkspace: MonacoWorkspace,
        @inject(MessageService) private readonly messageService: MessageService,

       
        
        // @inject(WorkspaceCommandContribution) private readonly workspaceCommandContribution: WorkspaceCommandContribution,
        // @inject(CommandService) private readonly commandService: CommandService,
        //@inject(CommandService) private readonly commandService: CommandService,
        @inject(ILogger) protected readonly logger: ILogger
    ) { }

    private readOnly = true;
    protected async switchWorkspace(path: string): Promise<void> {
        this.messageService.info(path);
         this.workspaceService.open(new TheiaURI(path), {
            preserveWindow: true
         });
    }

    private async setReadOnly(readOnly: boolean){
        console.log("setReadOnly");
        this.monacoWorkspace.onDidOpenTextDocument(() =>
        {
            console.log("onDidOpenTextDocument");
            this.monacoEditorService.getActiveCodeEditor()?.updateOptions({readOnly:readOnly});
            let editor = this.monacoEditorService.getActiveCodeEditor();
            console.log("editor - " + editor);
            if(editor){
                editor.updateOptions({readOnly:this.readOnly});
            }
        });
    }
     private compareFoldernames(path1: string, path2: string){
         return path1.substring(path1.length-77) === path2.substring(path2.length - 77);
     }
    configure(app: FrontendApplication): void{
        this.setReadOnly(this.readOnly);


        // this.workspaceService.onWorkspaceChanged((e) => {
        //     e.forEach((v, i , a)=> {
        //         console.log("For each");
        //         console.log(v);
        //         console.log(i);
        //         console.log(a);
        //     });
        //    // this.messageService.info();

            // this.monacoWorkspace.onDidSaveTextDocument(e =>{
            //  console.log("Did Save")
            //  console.log(e.uri);
            // });
        //    this.monacoWorkspace.onDidChangeTextDocument(e =>{
        //     console.log("Did change")
        //     console.log(e.contentChanges);
        //    });

           
           
        //});
    }
    onStart(app: FrontendApplication):void {
        // axios.get<JSON>( itlingoCloudURL + 'token_api/get-client-info/',{headers: {
        //     // 'Access-Control-Allow-Origin': '*',
        //     // 'Access-Control-Allow-Headers': '*',
        //     'Content-Type': 'text/plain',
        //   }},).then((response: any) => {
        //     console.log("user auth status: " + response.status);
        //     // if(response.status != 200){
        //     //     window.location.href = itlingoCloudURL;
        //     // }
        // }).catch((error) => {
        //         window.location.href = itlingoCloudURL;
        //         throw error;
        // });
         axios.get<JSON>('/getWorkspace',{},).then(
                 (response: any) => {
                     var prevRoot = this.workspaceService.tryGetRoots()[0] ;
                     //this.readOnly = response.readonly;
                     
                    if (prevRoot != undefined) {
                        if (!this.compareFoldernames(response.data.foldername.toString(), prevRoot.resource.path.toString())){
                            path = '' + response.data.foldername;
                            console.log("getWorkspace1")
                            console.log(path)
                            this.messageService.info("Changing Workspace to:" + response.data.foldername + " PREV:" + prevRoot.resource.path);
                            this.switchWorkspace(path);
                        }
                    } else {
                        path = '' + response.data.foldername;
                        console.log("getWorkspace2");
                        console.log(path);
                        this.messageService.info("Setting Workspace to:" + response.data.foldername + " STATUS:" + response.status);
                        this.switchWorkspace(path);
                    }
                 }
             );

         setInterval(() =>
         {
             axios.get<String>('/ping',{},);
        }, 60*1000);


        this.messageService.info("Welcome to ITLingo online IDE!");
    }
}


@injectable()
export class TheiaExampleExtensionCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TheiaExampleExtensionCommand, {
            execute: () => this.messageService.info('Hello World!')
        });
    }
}

@injectable()
export class TheiaExampleExtensionMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: TheiaExampleExtensionCommand.id,
            label: TheiaExampleExtensionCommand.label
        });
    }
}






@injectable()
export class ItLingoGrammarContribution implements LanguageGrammarDefinitionContribution {

    readonly id = 'rsl';
    readonly scopeName = 'source.rsl';

    registerTextmateLanguage(registry: TextmateRegistry) {
        languages.register({
            id: 'rsl',
            aliases: [
                'itlang', 'rsl'
            ],
            extensions: [
                '.rsl',
            ],
            mimetypes: [
                'text/rsl'
            ]
        });
        languages.setLanguageConfiguration(this.id, this.configuration);

        const statesGrammar = require('../../data/itlang.tmLanguage.json');
        registry.registerTextmateGrammarScope('source.rsl', {
            async getGrammarDefinition() {
                return {
                    format: 'json',
                    content: statesGrammar,
                };
            }
        });
        registry.mapLanguageIdToTextmateGrammar(this.id, 'source.rsl');
    }

    protected configuration: languages.LanguageConfiguration = {
        'comments': {
            'lineComment': '//',
            'blockComment': ['/*', '*/']
        },
        'brackets': [
            ['{', '}'],
            ['[', ']'],
            ['(', ')']
        ],
        'autoClosingPairs': [
            { 'open': '{', 'close': '}' },
            { 'open': '[', 'close': ']' },
            { 'open': '(', 'close': ')' },
            { 'open': "'", 'close': "'", 'notIn': ['string', 'comment'] },
            { 'open': '"', 'close': '"', 'notIn': ['string'] },
            { 'open': '/**', 'close': ' */', 'notIn': ['string'] }
        ],
        'surroundingPairs': [
            { 'open': '{', 'close': '}' },
            { 'open': '[', 'close': ']' },
            { 'open': '(', 'close': ')' },
            { 'open': "'", 'close': "'" },
            { 'open': '"', 'close': '"' },
            { 'open': '`', 'close': '`' }
        ],
        'folding': {
            'markers': {
                'start': new RegExp('^\\s*//\\s*#?region\\b'),
                'end': new RegExp('^\\s*//\\s*#?endregion\\b')
            }
        }
    };

}


