console.log("load-extension: loading...");

var walk    = require('walk');    //we used walk instead of findit because of sync. Sync causes stack error.. node --stack-size=32000 node_modules/gulp/bin/gulp.js
var path    = require('path');
var args    = require('yargs').argv;

let extensionDir = "";

let getExtensionWithWalk = function(){
    
    options = {
            followLinks: false, 
            
            filters: [".git", "node_modules", "testphantomjs", "bower_components"],    // directories with these keys will be skipped
        
            listeners: {    //need this way of coding to be sync!
                
                directories: function (dir, dirStatsArray, next) {
                    
                    var base = path.basename(dir);
                    console.log("base: ", base);
                    
                    if(base === 'public'){
                        
                        var moduleDir = path.resolve(dir, '..');    //absolute path eg /home/reda/opencart/smshare/smshareForOpencart/src/core2
                        
                        base = path.basename(moduleDir);
                        
                        if(base == args.m) {
                            
                            extensionDir = moduleDir;
                            
                        }else{
                            next();
                        }
                    }else{
                        next();
                    }
                        
                  }, 
                  
            }
        };
       
        walker = walk.walkSync("./src", options);
        
};


getExtensionWithWalk();    


module.exports = {
    "extensionDir" : extensionDir
};

console.log("load-extension: loaded");
