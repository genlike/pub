// @ts-check
require('es6-promise/auto');
require('reflect-metadata');
require('setimmediate');
const { Container } = require('inversify');
const { FrontendApplicationConfigProvider } = require('@theia/core/lib/browser/frontend-application-config-provider');

FrontendApplicationConfigProvider.set({
    "applicationName": "Eclipse Theia",
    "defaultTheme": "dark",
    "defaultIconTheme": "none",
    "electron": {
        "windowOptions": {}
    },
    "defaultLocale": "",
    "validatePreferencesSchema": true
});



const { ThemeService } = require('@theia/core/lib/browser/theming');
ThemeService.get().loadUserTheme();

const preloader = require('@theia/core/lib/browser/preloader');

// We need to fetch some data from the backend before the frontend starts (nls, os)
module.exports = preloader.preload().then(() => {
    const { FrontendApplication } = require('@theia/core/lib/browser');
    const { frontendApplicationModule } = require('@theia/core/lib/browser/frontend-application-module');
    const { messagingFrontendModule } = require('@theia/core/lib/browser/messaging/messaging-frontend-module');
    const { loggerFrontendModule } = require('@theia/core/lib/browser/logger-frontend-module');

    const container = new Container();
    container.load(frontendApplicationModule);
    container.load(messagingFrontendModule);
    container.load(loggerFrontendModule);

    return Promise.resolve()
        .then(start).catch(reason => {
            console.error('Failed to start the frontend application.');
            if (reason) {
                console.error(reason);
            }
        });

    function load(jsModule) {
        return Promise.resolve(jsModule.default)
            .then(containerModule => container.load(containerModule));
    }

    function start() {
        (window['theia'] = window['theia'] || {}).container = container;
        return container.get(FrontendApplication).start();
    }
});
