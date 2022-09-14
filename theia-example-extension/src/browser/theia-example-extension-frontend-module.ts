/**
 * Generated using theia-extension-generator
 */
import { ContainerModule } from '@theia/core/shared/inversify';
import {  TheiaSendBdFileUpdates } from './theia-example-extension-contribution';
import { FrontendApplicationContribution  } from '@theia/core/lib/browser';



export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(FrontendApplicationContribution).to(TheiaSendBdFileUpdates);
});



