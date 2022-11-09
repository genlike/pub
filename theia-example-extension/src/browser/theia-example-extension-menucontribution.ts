import { injectable } from '@theia/core/shared/inversify';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry } from '@theia/core/lib/common';
import { WorkspaceCommands } from '@theia/workspace/lib/browser';
import { TerminalMenus } from '@theia/terminal/src/browser/terminal-frontend-contribution';
import { CommonMenus } from '@theia/core/lib/browser';
import { TerminalWidgetImpl } from '@theia/terminal/lib/browser/terminal-widget-impl';

//import axios from 'axios';

@injectable()
export class TheiaExampleMenuContribution implements MenuContribution, CommandContribution {
    onCreate(term: TerminalWidgetImpl): void {}

    registerMenus(menus: MenuModelRegistry): void {
        //readOnly Registration
        menus.unregisterMenuAction(CommonMenus.FILE_NEW[CommonMenus.FILE_NEW.length - 1], CommonMenus.FILE);
        menus.unregisterMenuAction(CommonMenus.FILE_SAVE[CommonMenus.FILE_SAVE.length - 1], CommonMenus.FILE);
        menus.unregisterMenuAction(CommonMenus.FILE_AUTOSAVE[CommonMenus.FILE_AUTOSAVE.length - 1], CommonMenus.FILE);
        menus.unregisterMenuAction(CommonMenus.FILE_SETTINGS[CommonMenus.FILE_SETTINGS.length - 1], CommonMenus.FILE);
        menus.unregisterMenuAction(TerminalMenus.TERMINAL_TASKS[TerminalMenus.TERMINAL_TASKS.length - 1], TerminalMenus.TERMINAL);
        menus.unregisterMenuAction(TerminalMenus.TERMINAL_TASKS_INFO[TerminalMenus.TERMINAL_TASKS_INFO.length - 1], TerminalMenus.TERMINAL);
        menus.unregisterMenuAction(TerminalMenus.TERMINAL_TASKS_CONFIG[TerminalMenus.TERMINAL_TASKS_CONFIG.length - 1], TerminalMenus.TERMINAL);
        menus.unregisterMenuAction(TerminalMenus.TERMINAL_NEW[TerminalMenus.TERMINAL_NEW.length - 1], TerminalMenus.TERMINAL);
        //menus.unregisterMenuAction(CommonMenus.[CommonMenus.FILE_SETTINGS.length - 1], CommonMenus.FILE);
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

