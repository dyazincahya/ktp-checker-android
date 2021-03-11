const Observable = require("tns-core-modules/data/observable").Observable;
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const TimerModule = require("tns-core-modules/timer");
const lsHelper = require('./../localdb_helper');
const LoadingIndicatorModule = require("@nstudio/nativescript-loading-indicator").LoadingIndicator;
const Xloading = new LoadingIndicatorModule();
const snackBarModule = require("@nstudio/nativescript-snackbar").SnackBar;
const snackbar = new snackBarModule();

var context;
let framePage;
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
    let db = lsHelper.get();
    datalist.splice(0);
    if(db.success){
        if(db.data.length > 0){
            dataFound();
            let data = lsHelper.get().data;
            for (let i = 0; i < data.length; i++) {
                if(typeof data[i].lahir !== 'undefined'){
                    datalist.push({
                        nik: data[i].nik,
                        fullname: data[i].fullname,
                        kelamin: data[i].kelamin,
                        lahir: data[i].lahir,
                        provinsi: data[i].provinsi,
                        kotakab: data[i].kotakab,
                        kecamatan: data[i].kecamatan,
                        uniqcode: data[i].uniqcode,
                        tambahan: data[i].tambahan,
                        datechecker: data[i].datechecker,
                        isValid: true,
                        status: "VALID",
                        statusColor: "#4CAF50"
                    });
                } else {
                    datalist.push({
                        nik: data[i].nik,
                        fullname: data[i].fullname,
                        datechecker: data[i].datechecker,
                        isValid: false,
                        status: "TIDAK VALID",
                        statusColor: "#f44336"
                    });
                }
            }
        } else {
            dataFound(false);
            datalist.push([]);
        }
    } else {
        dataFound(false);
        datalist.push([]);
    }
    context.set("items", datalist);
    console.log(datalist); 
}

exports.onLoaded = function(args) {
    framePage = args.object.frame; 
};

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
            let db = lsHelper.drop();
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

exports.onItemTap = (args) => {
    let itemTap = args.view;
    let itemTapData = itemTap.bindingContext;
    
    framePage.navigate({
        moduleName: "riwayat/riwayat-detail-page",
        context: { data: itemTapData },
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
};