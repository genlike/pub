import { injectable } from '@theia/core/shared/inversify';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core/lib/common';
import { KeybindingContribution, KeybindingRegistry } from '@theia/core/lib/browser';
import { WorkspaceCommands } from '@theia/workspace/lib/browser';

import { CommonMenus, CommonCommands } from '@theia/core/lib/browser';

//import axios from 'axios';

@injectable()
export class TheiaExampleMenuContribution implements MenuContribution {
  

    registerMenus(menus: MenuModelRegistry): void {
        //readOnly Registration
        menus.unregisterMenuAction(CommonMenus.FILE_NEW[CommonMenus.FILE_NEW.length - 1], CommonMenus.FILE);
        menus.unregisterMenuAction(CommonMenus.FILE_SAVE[CommonMenus.FILE_SAVE.length - 1], CommonMenus.FILE);
        menus.unregisterMenuAction(CommonMenus.FILE_AUTOSAVE[CommonMenus.FILE_AUTOSAVE.length - 1], CommonMenus.FILE);
        menus.unregisterMenuAction(CommonMenus.FILE_SETTINGS[CommonMenus.FILE_SETTINGS.length - 1], CommonMenus.FILE);
        
        //menus.unregisterMenuAction(TerminalMenus.TERMINAL.slice(-1)[0]);
        // menus.unregisterMenuAction(TerminalMenus.TERMINAL_TASKS_INFO[TerminalMenus.TERMINAL_TASKS_INFO.length - 1], TerminalMenus.TERMINAL);
        // menus.unregisterMenuAction(TerminalMenus.TERMINAL_TASKS_CONFIG[TerminalMenus.TERMINAL_TASKS_CONFIG.length - 1], TerminalMenus.TERMINAL);
        // menus.unregisterMenuAction(TerminalMenus.TERMINAL_NEW[TerminalMenus.TERMINAL_NEW.length - 1], TerminalMenus.TERMINAL);
        // menus.un
        //menus.unregisterMenuNode(TerminalMenus.TERMINAL[TerminalMenus.TERMINAL.length-1]);

        //menus.unregisterMenuAction(CommonMenus.[CommonMenus.FILE_SETTINGS.length - 1], CommonMenus.FILE);
        //menus.unregisterMenuAction(CommonMenus.FILE_NEW[CommonMenus.FILE_NEW.length - 1], CommonMenus.FILE);
    }


}



@injectable()
export class TheiaExampleCommandContribution implements  CommandContribution {
    registerCommands(commands: CommandRegistry): void {
        //readOnly Registration (remove right click)
       commands.unregisterCommand(WorkspaceCommands.FILE_DELETE);
       commands.unregisterCommand(WorkspaceCommands.NEW_FILE);
       commands.unregisterCommand(WorkspaceCommands.ADD_FOLDER);
       commands.unregisterCommand(WorkspaceCommands.NEW_FOLDER);
       commands.unregisterCommand(WorkspaceCommands.FILE_DUPLICATE);
       commands.unregisterCommand(WorkspaceCommands.FILE_RENAME);
       commands.unregisterCommand(CommonCommands.PASTE);
       commands.unregisterCommand(CommonCommands.COPY);
   }

}


@injectable()
export class TheiaExampleKeybindingContribution implements KeybindingContribution {
    registerKeybindings(keybindings: KeybindingRegistry): void {
        keybindings.unregisterKeybinding("ctrl+v");
        keybindings.unregisterKeybinding("cmd+v");
        keybindings.unregisterKeybinding("ctrl+c");
        keybindings.unregisterKeybinding("cmd+c");
    }
}