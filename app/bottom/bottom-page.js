const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");

const pengecekan = require("../pengecekan/pengecekan-page");
const riwayat = require("../riwayat/riwayat-page");

const Observable = require("tns-core-modules/data/observable").Observable;


let context;
let ndata;
let framePage;

exports.onLoaded = function(args) {
    framePage = args.object.frame;
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = new Observable();

    if(page.navigationContext){
        ndata = page.navigationContext;
        if(ndata.position){
            context.set("navIndex", ndata.navIndex);
        } else {
            context.set("navIndex", 0);
        }
    } else {
        context.set("navIndex", 0);
    }

    page.bindingContext = context;
};

exports.moveToNav = function(idx) {
    context.set("navIndex", idx);
};

exports.moveToRiwayat = function(){
    context.set("navIndex", 1);
    riwayat.refreshPageTap();
}

exports.riwayatTap = function(){
    riwayat.refreshPageTap();
}
exports.pengecekanTap = function(){
    pengecekan.ceklagi();
}