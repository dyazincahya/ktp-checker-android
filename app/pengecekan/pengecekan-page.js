const Observable = require("tns-core-modules/data/observable").Observable;
const TimerModule = require("tns-core-modules/timer");
const NpModule = require('./../nik_parse.min');
const lsHelper = require('./../localdb_helper');
const LoadingIndicatorModule = require("@nstudio/nativescript-loading-indicator").LoadingIndicator;
const Xloading = new LoadingIndicatorModule();
const snackBarModule = require("@nstudio/nativescript-snackbar").SnackBar;
const snackbar = new snackBarModule();
const connectivityModule = require("tns-core-modules/connectivity");
const bottom = require("../bottom/bottom-page");
const riwayat = require("../riwayat/riwayat-page");

var context;
function searchMode(search=true){
    if(search){
        context.set("isSearchForm", true);
        context.set("isResult", false);
    } else {
        context.set("isSearchForm", false);
        context.set("isResult", true);
    }
}

function checkConnection(notif=false){
    const type = connectivityModule.getConnectionType();
    let message = "";
    switch (type) {
        case connectivityModule.connectionType.none:
            message = "Tidak terhubung ke jaringan Internet";
            context.set("connectedText", message);
            context.set("connected", false);
            break;
        case connectivityModule.connectionType.wifi:
            message = "Sedang terhubung menggunakan koneksi WIFI";
            context.set("connectedText", message);
            context.set("connected", true);
            break;
        case connectivityModule.connectionType.mobile:
            message = "Sedang terhubung menggunakan koneksi Mobile";
            context.set("connectedText", message);
            context.set("connected", true);
            break;
        case connectivityModule.connectionType.ethernet:
            message = "Sedang terhubung menggunakan koneksi Hotspot";
            context.set("connectedText", message);
            context.set("connected", true);
            break;
        default:
            message = "Tidak terhubung ke jaringan Internet";
            context.set("connectedText", message);
            context.set("connected", false);
            break;
    }
    Xloading.hide();

    if(notif){
        snackbar.action({
            actionText: "OKE",
            actionTextColor: '#FFEB3B',
            snackText: message,
            textColor: '#FFFFFF',
            hideDelay: 5000,
            backgroundColor: '#333',
            maxLines: 15, // Optional, Android Only
            isRTL: false
        });
    }
}

function isConn(){
    const type = connectivityModule.getConnectionType();
    if(type === connectivityModule.connectionType.none ){
        context.set("connectedText", "Tidak terhubung ke jaringan Internet");
        // context.set("connected", false);
        return false;
    } else if(type === connectivityModule.connectionType.wifi) {
        context.set("connectedText", "Sedang terhubung menggunakan koneksi WIFI");
        // context.set("connected", true);
        return true;
    } else if(type === connectivityModule.connectionType.mobile){
        context.set("connectedText", "Sedang terhubung menggunakan koneksi Mobile");
        // context.set("connected", true);
        return true;
    } else if(type === connectivityModule.connectionType.ethernet){
        context.set("connectedText", "Sedang terhubung menggunakan koneksi Hotspot");
        // context.set("connected", true);
        return true;
    } else {
        context.set("connectedText", "Tidak terhubung ke jaringan Internet");
        // context.set("connected", false);
        return false;
    }
}

exports.onLoaded = function(){
    context.set("isValid", false);
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = new Observable();

    Xloading.show(gConfig.connectionOption);
    searchMode();
    checkConnection();
    
    page.bindingContext = context;
};

exports.ceknoktp = function(){
    Xloading.show(gConfig.searchOption);
    if(isConn()){
        if((context.fullname == "" && context.nik == "") || (context.fullname == undefined && context.nik == undefined)){
            snackbar.action({
                actionText: "OKE",
                actionTextColor: '#FFEB3B',
                snackText: "Nama Lengkap & No. KTP tidak boleh kosong!",
                textColor: '#FFFFFF',
                hideDelay: 7000,
                backgroundColor: '#333',
                maxLines: 15, // Optional, Android Only
                isRTL: false
            });
            Xloading.hide();
        } else {
            TimerModule.setTimeout(() => {
                NpModule.nikParse(context.nik, function(result){
                    if(result.status == "success"){
                        let data = result.data;
                        context.set("kelamin", data.kelamin);
                        context.set("lahir", data.lahir);
                        context.set("provinsi", data.provinsi);
                        context.set("kotakab", data.kotakab);
                        context.set("kecamatan", data.kecamatan);
                        context.set("uniqcode", data.uniqcode);
                        context.set("kodepos", data.tambahan.kodepos);
                        context.set("pasaran", data.tambahan.pasaran);
                        context.set("usia", data.tambahan.usia);
                        context.set("ultah", data.tambahan.ultah);
                        context.set("zodiak", data.tambahan.zodiak);
                        context.set("isValid", true);
                        context.set("status", "VALID");
                        context.set("statusColor", "#4CAF50");
                        context.set("datechecker", lsHelper.getCurrentTime());
                        data.fullname = context.fullname;
                        data.datechecker = lsHelper.getCurrentTime();
                        
                        let a = lsHelper.insert(data);
                        if(a.success){
                            searchMode(false);
                        } else {
                            snackbar.action({
                                actionText: "OKE",
                                actionTextColor: '#FFEB3B',
                                snackText: a.message,
                                textColor: '#FFFFFF',
                                hideDelay: 5000,
                                backgroundColor: '#333',
                                maxLines: 15, // Optional, Android Only
                                isRTL: false
                            });
                        }
                    } else { 
                        console.log(result);
                        let a = lsHelper.insert({
                            fullname: context.fullname,
                            nik: context.nik,
                            datechecker: lsHelper.getCurrentTime()
                        });
                        if(a.success){
                            searchMode(false);
                            if(result.status == "error"){
                                context.set("isValid", false);
                                context.set("status", "TIDAK VALID");
                                context.set("statusColor", "#f44336");
                                context.set("datechecker", lsHelper.getCurrentTime());
                            }
                        }
                        /* snackbar.action({
                            actionText: "OKE",
                            actionTextColor: '#FFEB3B',
                            snackText: "No. KTP tidak valid! Harap periksa kembali.",
                            textColor: '#FFFFFF',
                            hideDelay: 7000,
                            backgroundColor: '#333',
                            maxLines: 15, // Optional, Android Only
                            isRTL: false
                        }); */
                    }
                    Xloading.hide();
                });
            }, 1500);
        }
    } else {
        TimerModule.setTimeout(() => {
            snackbar.action({
                actionText: "OKE",
                actionTextColor: '#FFEB3B',
                snackText: "Mohon cek jaringan Internet kamu!",
                textColor: '#FFFFFF',
                hideDelay: 3000,
                backgroundColor: '#333',
                maxLines: 15, // Optional, Android Only
                isRTL: false
            });
            context.set("connected", false);
            Xloading.hide();
        }, 1500);
    }
};

exports.ceklagi = function(){
    searchMode();
};

exports.recheckConnection = function(){
    Xloading.show(gConfig.connectionOption);
    TimerModule.setTimeout(() => {
        checkConnection(true);
    }, 3000);
};

exports.lihatriwayat = function(){
    bottom.moveToNav(1);
    riwayat.refreshPageTap();
};