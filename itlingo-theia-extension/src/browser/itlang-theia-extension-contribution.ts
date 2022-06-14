import { injectable, inject } from '@theia/core/shared/inversify';
import { Command, CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from '@theia/core/lib/common';
import { CommonMenus } from '@theia/core/lib/browser';

export const ItlangTheiaExtensionCommand: Command = {
    id: 'ItlangTheiaExtension.command',
    label: 'Say Hello'
};

@injectable()
export class ItlangTheiaExtensionCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(ItlangTheiaExtensionCommand, {
            execute: () => this.messageService.info('Hello World!')
        });
    }
}

@injectable()
export class ItlangTheiaExtensionMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: ItlangTheiaExtensionCommand.id,
            label: ItlangTheiaExtensionCommand.label
        });
    }
}
