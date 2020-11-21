const appSettings = require("tns-core-modules/application-settings");

exports.get = function(index="all", xkey="ldkc"){
    if(!appSettings.hasKey(xkey)){
        return {
            "success"   : false,
            "message"   : "Data not found!",
            "data"      : []
        };
    } else {
        if(index == "all"){
            return {
                "success"   : true,
                "message"   : "Data found.",
                "data"      : JSON.parse(appSettings.getString(xkey))
            };
        } else {
            if ( tmpdata[index] !== void 0 ) {
                return {
                    "success"   : true,
                    "message"   : "Data found.",
                    "data"      : JSON.parse(appSettings.getString(xkey))[index]
                };
            } else {

                return {
                    "success"   : false,
                    "message"   : "Index not found!",
                    "data"      : []
                };
            }
        }
        
    }
};

exports.insert = function(data=[], xkey="ldkc"){
    if(data.length == 0 || Object.keys(data).length == 0){
        return {
            "success"   : false,
            "message"   : "Data is null!",
            "data"      : data
        };
    } else {
        if(!appSettings.hasKey(xkey)){
            appSettings.setString(xkey, JSON.stringify(data));

            return {
                "success"   : true,
                "message"   : "Data has been inserted!",
                "data"      : data
            };
        } else {
            let tmpdata = [];
            let extractdata = JSON.parse(appSettings.getString(xkey));
            tmpdata.push(extractdata);
            tmpdata.push(data);
            appSettings.remove(xkey);
            appSettings.setString(xkey, JSON.stringify(tmpdata));

            return {
                "success"   : true,
                "message"   : "Data has been inserted.",
                "data"      : data
            };
        }
    }
};

exports.update = function(data=[], index=0, xkey="ldkc"){
    if(data.length == 0 || Object.keys(data).length == 0){
        return {
            "success"   : false,
            "message"   : "Data is null!",
            "data"      : data
        };
    } else {
        let tmpdata = [];
        let extractdata = JSON.parse(appSettings.getString(xkey));
        tmpdata.push(extractdata);

        if ( tmpdata[index] !== void 0 ) {
            delete tmpdata[index];

            let newdata = [];
            for (let i = 0; i < tmpdata.length; i++) {
                if(tmpdata[i] != undefined || tmpdata[i] != "undefined"){
                    newdata.push(tmpdata[i]);
                } else {
                    newdata.push(data);
                }           
            }

            appSettings.remove(xkey);
            appSettings.setString(xkey, JSON.stringify(newdata));
            
            return {
                "success"   : true,
                "message"   : "Data has been updated.",
                "data"      : data
            };
        } else {
            return {
                "success"   : false,
                "message"   : "Index not found!",
                "data"      : data
            };
        }
    }
};

exports.delete = function(index=0, xkey="ldkc"){
    if(!appSettings.hasKey(xkey)){
        return {
            "success" : false,
            "message" : "Database not found!"
        };
    } else {
        let tmpdata = [];
        let extractdata = JSON.parse(appSettings.getString(xkey));
        tmpdata.push(extractdata);

        if ( tmpdata[index] !== void 0 ) {
            delete tmpdata[index];
            
            let newdata = [];
            for (let i = 0; i < tmpdata.length; i++) {
                if(tmpdata[i] != undefined || tmpdata[i] != "undefined"){
                    newdata.push(tmpdata[i]);
                }            
            }
            
            appSettings.remove(xkey);
            appSettings.setString(xkey, JSON.stringify(newdata));

            return {
                "success" : true,
                "message" : "Data has been deleted."
            };
        } else {
            return {
                "success" : false,
                "message" : "Index not found!"
            };
        }
    }
};
 
exports.truncate = function(xkey="ldkc"){
    if(!appSettings.hasKey(xkey)){
        return {
            "success" : false,
            "message" : "Database not found!"
        };
    } else {
        appSettings.remove(xkey);
        appSettings.setString(xkey, JSON.stringify([]));
        
        return {
            "success" : true,
            "message" : "Database has been truncated."
        };
    }
};

exports.drop = function(xkey="ldkc"){
    if(!appSettings.hasKey(xkey)){
        return {
            "success" : false,
            "message" : "Database not found!"
        };
    } else {
        appSettings.remove(xkey);
        
        return {
            "success" : true,
            "message" : "Database has been dropped."
        };
    }
};