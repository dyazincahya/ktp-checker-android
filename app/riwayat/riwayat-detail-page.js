const timerModule = require("tns-core-modules/timer");
const application = require("tns-core-modules/application");
const Observable = require("tns-core-modules/data/observable").Observable;

let context;
let framePage;
let ndata;

exports.onLoaded = function(args) {
    framePage = args.object.frame; 
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    ndata = page.navigationContext;
    context = new Observable();

    application.android.on(application.AndroidApplication.activityBackPressedEvent, (args) => {
        args.cancel = true;
        framePage.goBack();        
    });

    timerModule.setTimeout(() => {
        context.set("fullname", ndata.data.fullname);
        context.set("nik", ndata.data.nik);
        context.set("kelamin", ndata.data.kelamin);
        context.set("lahir", ndata.data.tambahan.pasaran);
        context.set("provinsi", ndata.data.provinsi);
        context.set("kotakab", ndata.data.kotakab);
        context.set("kecamatan", ndata.data.kecamatan);
        context.set("kodepos", ndata.data.tambahan.kodepos);
        context.set("usia", ndata.data.tambahan.usia);
        context.set("ultah", ndata.data.tambahan.ultah);
        context.set("zodiak", ndata.data.tambahan.zodiak);
    }, 150);

    page.bindingContext = context;
};

exports.onBackButtonTap = function(){
    framePage.goBack();
};