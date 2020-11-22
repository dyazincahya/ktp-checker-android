const Observable = require("tns-core-modules/data/observable").Observable;
const TimerModule = require("tns-core-modules/timer");
const NpModule = require('./../nik_parse.min');
const lsHelper = require('./../localdb_helper');
const LoadingIndicatorModule = require("@nstudio/nativescript-loading-indicator").LoadingIndicator;
const Xloading = new LoadingIndicatorModule();
const snackBarModule = require("@nstudio/nativescript-snackbar").SnackBar;
const snackbar = new snackBarModule();
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

exports.onLoaded = function(){

};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = new Observable();

    searchMode();
    
    page.bindingContext = context;
};

exports.ceknoktp = function(){
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
    } else {
        Xloading.show(gConfig.searchOption);
        TimerModule.setTimeout(() => {
            NpModule.nikParse(context.nik, function(result){
                if(result.status == "success"){
                    let data = result.data;
                    context.set("kelamin", data.kelamin);
                    context.set("lahir", data.tambahan.pasaran);
                    context.set("provinsi", data.provinsi);
                    context.set("kotakab", data.kotakab);
                    context.set("kecamatan", data.kecamatan);
                    context.set("kodepos", data.tambahan.kodepos);
                    context.set("usia", data.tambahan.usia);
                    context.set("ultah", data.tambahan.ultah);
                    context.set("zodiak", data.tambahan.zodiak);
                    data.fullname = context.fullname;
                    
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
                    snackbar.action({
                        actionText: "OKE",
                        actionTextColor: '#FFEB3B',
                        snackText: "No. KTP tidak valid! Harap periksa kembali.",
                        textColor: '#FFFFFF',
                        hideDelay: 7000,
                        backgroundColor: '#333',
                        maxLines: 15, // Optional, Android Only
                        isRTL: false
                    });
                }
                Xloading.hide();
            });
        }, 1500);
    }
};

exports.ceklagi = function(){
    /* context.set("fullname", "");
    context.set("nik", ""); */
    searchMode();
};

exports.lihatriwayat = function(){
    bottom.moveToNav(1);
    riwayat.refreshPageTap();
};