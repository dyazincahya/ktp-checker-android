const Observable = require("tns-core-modules/data/observable").Observable;
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const TimerModule = require("tns-core-modules/timer");
const LdHelper = require('./../localdb_helper');
const LoadingIndicatorModule = require("@nstudio/nativescript-loading-indicator").LoadingIndicator;
const Xloading = new LoadingIndicatorModule();
const snackBarModule = require("@nstudio/nativescript-snackbar").SnackBar;
const snackbar = new snackBarModule();

var context;
var datalist = new ObservableArray([]);

function dataFound(x=true){
    if(x){
        context.set("isFound", true);
        context.set("isNotFound", false);
    } else {
        context.set("isFound", false);
        context.set("isNotFound", true);
    }
}

function loadData(){
    let db = LdHelper.get();
    datalist.splice(0);
    if(db.success){
        if(db.data.length > 0){
            dataFound();
            datalist.push(LdHelper.get().data);
        } else {
            dataFound(false);
            datalist.push([]);
        }
    } else {
        dataFound(false);
        datalist.push([]);
    }
    context.set("items", datalist);
}

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = new Observable();

    Xloading.show(gConfig.loadingOption);
    TimerModule.setTimeout(() => {
        loadData();
        Xloading.hide();
    }, 500);   

    page.bindingContext = context;
};

exports.refreshPageTap = function(){
    Xloading.show(gConfig.loadingOption);
    TimerModule.setTimeout(() => {
        loadData();
        Xloading.hide();
    }, 1000);
};

exports.clearAllTap = function(){
    confirm({
        title: "Bersikan data riwayat",
        message: "Apa kamu yakin ingin melakukan ini?",
        okButtonText: "Ya",
        neutralButtonText: "Tidak"
    }).then((result) => {
        if(result) {
            let db = LdHelper.drop();
            if(db.success){
                Xloading.show(gConfig.cleaningOption);
                TimerModule.setTimeout(() => {
                    loadData();
                    Xloading.hide();
                    snackbar.action({
                        actionText: "OKE",
                        actionTextColor: '#FFEB3B',
                        snackText: "Data riwayat berhasil dibersihkan :)",
                        textColor: '#FFFFFF',
                        hideDelay: 5000,
                        backgroundColor: '#333',
                        maxLines: 15, // Optional, Android Only
                        isRTL: false
                    });
                }, 1000);
            } else {
                Xloading.show(gConfig.cleaningOption);
                TimerModule.setTimeout(() => {
                    loadData();
                    Xloading.hide();
                    snackbar.action({
                        actionText: "OKE",
                        actionTextColor: '#FFEB3B',
                        snackText: "Data kosong!.",
                        textColor: '#FFFFFF',
                        hideDelay: 3500,
                        backgroundColor: '#333',
                        maxLines: 15, // Optional, Android Only
                        isRTL: false
                    });
                }, 1000);
            }
        }
    });
};