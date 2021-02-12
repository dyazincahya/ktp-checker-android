const Observable = require("tns-core-modules/data/observable").Observable;
const utilsModule = require("tns-core-modules/utils/utils");

var context;

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = new Observable();

    page.bindingContext = context;
};

exports.ratenow = function(){
    utilsModule.openUrl("https://play.google.com/store/apps/details?id=com.kang.cahya.KtpChecker");
};