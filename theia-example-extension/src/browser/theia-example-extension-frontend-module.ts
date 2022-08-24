/**
 * Generated using theia-extension-generator
 */
import { TheiaExampleExtensionCommandContribution, TheiaExampleExtensionMenuContribution } from './theia-example-extension-contribution';
//import { ITLangLanguageClientContribution } from './itlang-dsl-language-client-contribution';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';
//import { LanguageClientContribution } from '@theia/languages/lib/browser';
import { LanguageGrammarDefinitionContribution } from '@theia/monaco/lib/browser/textmate';
import { ItLingoGrammarContribution, TheiaSendBdFileUpdates, YourEditorManager } from './theia-example-extension-contribution';
//import { EditorManager } from '@theia/editor/lib/browser/editor-manager';
import { FrontendApplicationContribution  } from '@theia/core/lib/browser';



export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(TheiaExampleExtensionCommandContribution);
    bind(MenuContribution).to(TheiaExampleExtensionMenuContribution);
    bind(LanguageGrammarDefinitionContribution).to(ItLingoGrammarContribution )
    bind(FrontendApplicationContribution).to(TheiaSendBdFileUpdates);
    bind(YourEditorManager).toSelf().inSingletonScope();
    //bind(EditorManager).to(YourEditorManager).inSingletonScope();

    //bind(ITLangLanguageClientContribution).toSelf().inSingletonScope();
    //bind(LanguageClientContribution).toService(ITLangLanguageClientContribution);
});



