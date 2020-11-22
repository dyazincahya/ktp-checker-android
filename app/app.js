const application = require("tns-core-modules/application");
const ModeLoadingIndicator = require('@nstudio/nativescript-loading-indicator').Mode;

global.gLocalstorage = [];
global.gConfig = {
    "searchOption": {
        message: 'Sedang mengecek data...',
        margin: 10,
        dimBackground: true,
        color: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        userInteractionEnabled: true,
        hideBezel: true, 
        mode: ModeLoadingIndicator.Indeterminate,
        android: {
            cancelable: false,
        }
    },
    "loadingOption": {
        message: 'Sedang memuat...',
        margin: 10,
        dimBackground: true,
        color: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        userInteractionEnabled: true,
        hideBezel: true, 
        mode: ModeLoadingIndicator.Indeterminate,
        android: {
            cancelable: false,
        }
    },
    "cleaningOption": {
        message: 'Sedang membersihkan...',
        margin: 10,
        dimBackground: true,
        color: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        userInteractionEnabled: true,
        hideBezel: true, 
        mode: ModeLoadingIndicator.Indeterminate,
        android: {
            cancelable: false,
        }
    }
};
application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
