const Observable = require("tns-core-modules/data/observable").Observable;

var context;

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = new Observable();

    page.bindingContext = context;
};