
import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService} from '@theia/core/lib/common';
import { CommonMenus, FrontendApplication } from '@theia/core/lib/browser';
import { LanguageGrammarDefinitionContribution, TextmateRegistry} from "@theia/monaco/lib/browser/textmate";
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { MonacoWorkspace } from '@theia/monaco/lib/browser/monaco-workspace';
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
        //@inject(MonacoWorkspace) private readonly monacoWorkspace: MonacoWorkspace,
        @inject(MessageService) private readonly messageService: MessageService,

       
        
        // @inject(WorkspaceCommandContribution) private readonly workspaceCommandContribution: WorkspaceCommandContribution,
        // @inject(CommandService) private readonly commandService: CommandService,
        //@inject(CommandService) private readonly commandService: CommandService,
        @inject(ILogger) protected readonly logger: ILogger
    ) { }

    protected async switchWorkspace(path: string): Promise<void> {
        this.messageService.info(path);
         this.workspaceService.open(new TheiaURI(path), {
            preserveWindow: true
         });
    }
     private compareFoldernames(path1: string, path2: string){
         return path1.substring(path1.length-50) === path2.substring(path2.length - 50);
     }
    configure(app: FrontendApplication): void{

        // this.workspaceService.onWorkspaceChanged((e) => {
        //     e.forEach((v, i , a)=> {
        //         console.log("For each");
        //         console.log(v);
        //         console.log(i);
        //         console.log(a);
        //     });
        //    // this.messageService.info();

        //    this.monacoWorkspace.onDidSaveTextDocument(e =>{
        //     console.log("Did Save")
        //     console.log(e.uri);
        //    });
        //    this.monacoWorkspace.onDidChangeTextDocument(e =>{
        //     console.log("Did change")
        //     console.log(e.contentChanges);
        //    });

           
           
        //});
    }
    onStart(app: FrontendApplication):void {
        
         axios.get<String>('/getWorkspace',{},).then(
                 response => {
                     var prevRoot = this.workspaceService.tryGetRoots()[0] ;
                     if (prevRoot != undefined) {
                          if (!this.compareFoldernames(response.data.toString(), prevRoot.resource.path.toString())){
                              path = '' + response.data;
                              this.messageService.info("Changing Workspace to:" + response.data + " PREV:" + prevRoot.resource.path);
                              this.switchWorkspace(path);
                         }
                     } else {
                         path = '' + response.data;
                         this.messageService.info("Setting Workspace to:" + response.data + " STATUS:" + response.status);
                         this.switchWorkspace(path);
                     }
                 }
             );

        // setInterval(() =>
        // {
        //     axios.get<String>('http://'+ remoteHostIp +':3010/ping',{},);
        // }, 1000);
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

    readonly id = 'itlang';
    readonly scopeName = 'source.rsl';

    registerTextmateLanguage(registry: TextmateRegistry) {
        languages.register({
            id: 'itlang',
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


