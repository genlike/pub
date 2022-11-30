import { injectable, inject } from '@theia/core/shared/inversify';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core/lib/common';
import { KeybindingContribution, KeybindingRegistry, QuickInputService } from '@theia/core/lib/browser';
// import { WorkspaceCommands } from '@theia/workspace/lib/browser';

// import {  CommonCommands } from '@theia/core/lib/browser';

//import axios from 'axios';

//var g_readOnly:boolean | undefined = undefined;

@injectable()
export class TheiaExampleMenuContribution implements MenuContribution {
    async registerMenus(menus: MenuModelRegistry): Promise<void> {
        
    }
}



@injectable()
export class TheiaExampleCommandContribution implements  CommandContribution {

    @inject(QuickInputService)
    protected readonly quickInputService: QuickInputService;

   async registerCommands(commands: CommandRegistry): Promise<void> {
        
        // const readOnly = await getReadonly();
        //     if(readOnly){
        //         commands.unregisterCommand(WorkspaceCommands.FILE_DELETE);
        //         commands.unregisterCommand(WorkspaceCommands.NEW_FILE);
        //         commands.unregisterCommand(WorkspaceCommands.ADD_FOLDER);
        //         commands.unregisterCommand(WorkspaceCommands.NEW_FOLDER);
        //         commands.unregisterCommand(WorkspaceCommands.FILE_DUPLICATE);
        //         commands.unregisterCommand(WorkspaceCommands.FILE_RENAME);
        //         commands.unregisterCommand(CommonCommands.PASTE);
        //         commands.unregisterCommand(CommonCommands.COPY);
        //     } else {
        //         commands.registerCommand(WorkspaceCommands.FILE_DELETE);
        //         commands.registerCommand(WorkspaceCommands.NEW_FILE);
        //         commands.registerCommand(WorkspaceCommands.ADD_FOLDER);
        //         commands.registerCommand(WorkspaceCommands.NEW_FOLDER);
        //         commands.registerCommand(WorkspaceCommands.FILE_DUPLICATE);
        //         commands.registerCommand(WorkspaceCommands.FILE_RENAME);
        //         commands.registerCommand(CommonCommands.PASTE);
        //         commands.registerCommand(CommonCommands.COPY);
        //     }
    }
}


@injectable()
export class TheiaExampleKeybindingContribution implements KeybindingContribution {
    async registerKeybindings(keybindings: KeybindingRegistry): Promise<void> {
        //const readOnly = await getReadonly()
            // if(readOnly){
            //     keybindings.unregisterKeybinding("ctrl+v");
            //     keybindings.unregisterKeybinding("cmd+v");
            //     keybindings.unregisterKeybinding("ctrl+c");
            //     keybindings.unregisterKeybinding("cmd+c");
            // }
    }
}




// async function getReadonly(): Promise<boolean>{
//     console.log("g_readonly= " + g_readOnly);
//     if(g_readOnly == undefined) {
//         const result = await axios.get<any>('/getWorkspace',{},)
//         g_readOnly = !result.data.readonly;
//         console.log("g_readonly= " + g_readOnly);
//         return g_readOnly ?? false;
//     }
//     return g_readOnly;
// }