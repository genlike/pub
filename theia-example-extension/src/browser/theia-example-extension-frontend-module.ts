/**
 * Generated using theia-extension-generator
 */
import { ContainerModule } from '@theia/core/shared/inversify';
import { TheiaSendBdFileUpdates } from './theia-example-extension-contribution';
import { GettingStartedWidget } from './theia-example-extension-widget';
import { TheiaExampleMenuContribution, TheiaExampleCommandContribution, TheiaExampleKeybindingContribution } from './theia-example-extension-menucontribution';
import { WidgetFactory, FrontendApplicationContribution, bindViewContribution  } from '@theia/core/lib/browser';
import { KeybindingContribution } from '@theia/core/lib/browser';

import { CommandContribution, MenuContribution } from '@theia/core/lib/common';

import '../../src/browser/style/index.css';


export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(FrontendApplicationContribution).to(TheiaSendBdFileUpdates);
    bindViewContribution(bind, TheiaSendBdFileUpdates);
    bind(FrontendApplicationContribution).toService(TheiaSendBdFileUpdates);
    bind(CommandContribution).to(TheiaExampleCommandContribution);
    bind(MenuContribution).to(TheiaExampleMenuContribution);
    bind(KeybindingContribution).to(TheiaExampleKeybindingContribution);
    bind(GettingStartedWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: GettingStartedWidget.ID,
        createWidget: () => context.container.get<GettingStartedWidget>(GettingStartedWidget),
    })).inSingletonScope();
});



