import { injectable } from '@theia/core/shared/inversify';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core/lib/common';
import { WorkspaceCommands } from '@theia/workspace/lib/browser';
import { CommonMenus } from '@theia/core/lib/browser';

//import axios from 'axios';

@injectable()
export class TheiaExampleMenuContribution implements MenuContribution, CommandContribution {

    registerMenus(menus: MenuModelRegistry): void {
        //readOnly Registration
        menus.unregisterMenuAction(CommonMenus.FILE_NEW[CommonMenus.FILE_NEW.length - 1], CommonMenus.FILE);
        menus.unregisterMenuAction(CommonMenus.FILE_SAVE[CommonMenus.FILE_SAVE.length - 1], CommonMenus.FILE);
        menus.unregisterMenuAction(CommonMenus.FILE_AUTOSAVE[CommonMenus.FILE_AUTOSAVE.length - 1], CommonMenus.FILE);
        menus.unregisterMenuAction(CommonMenus.FILE_SETTINGS[CommonMenus.FILE_SETTINGS.length - 1], CommonMenus.FILE);
        //menus.unregisterMenuAction(CommonMenus.FILE_NEW[CommonMenus.FILE_NEW.length - 1], CommonMenus.FILE);
    }

    registerCommands(commands: CommandRegistry): void {
         //readOnly Registration (remove right click)
        commands.unregisterCommand(WorkspaceCommands.FILE_DELETE);
        commands.unregisterCommand(WorkspaceCommands.NEW_FILE);
        commands.unregisterCommand(WorkspaceCommands.NEW_FOLDER);
        commands.unregisterCommand(WorkspaceCommands.FILE_DUPLICATE);
        commands.unregisterCommand(WorkspaceCommands.FILE_RENAME);
    }
}

