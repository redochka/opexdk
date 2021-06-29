const walkdir = require('walkdir');    //we used walk instead of findit because of sync. Sync causes stack error.. node --stack-size=32000 node_modules/gulp/bin/gulp.js
const path    = require('path');
const fs      = require('fs');
const log     = require('fancy-log');
const debug   = require('debug')('walkdir');

const getExtensionPathWithWalk = function (args) {

    let _shortName = args.m;

    /*
     *
     */
    if (!_shortName) {
        console.log("Required _shortName not found. Aborting!");
        return;
    }


    //result
    let extensionDir = "";


    const options = {
        "max_depth": 4
    };

    const callback = function (mypath, stat) {

        /*
         * Will be called for each path traversed after the extension was found.
         */
        if (extensionDir) return;  //extension was found but there is no way to stop the execution of sync walk.

        /*
         * ignore all .git directories.
         */
        if (
            path.basename(mypath) === ".git" ||
            path.basename(mypath) === "node_modules" ||
            path.basename(mypath) === "testphantomjs" ||
            path.basename(mypath) === "bower_components"
        ) {
            debug("[walker-task] ignoring: " + path.basename(mypath));
            this.ignore(mypath)
        }

        /*
         *
         */
        let base = path.basename(mypath);
        debug("[walker-task] base is: ", base, " path is: ", mypath);

        /*
         *
         */
        if (base === _shortName) {
            extensionDir = mypath;
            debug("[walker-task] Extension found.".green);

        } else {
            /*
             * check if manifest exists and load shortname
             */
            let manifestPath = mypath + "/manifest.json";
            if (fs.existsSync(manifestPath)) {
                debug("[walker-task] manifest.json found. Going to load it");
                let manifest = require(manifestPath);
                debug("[walker-task] manifest.json content is: ", manifest);
                if (manifest.shortName && manifest.shortName === _shortName) {
                    extensionDir = mypath;
                    debug("[walker-task] Extension found.".green);
                }
            }

        }

    };

    let homeEnv = process.env.OPEXDK_SRC_PATH;
    debug("★ homeEnv: ", homeEnv);
    let homes = homeEnv.split(",");
    for (const home of homes) {
        debug(home);
        walkdir.sync(home, options, callback);
        if (extensionDir) {
            return extensionDir;
        }
    }
    return null;
};


module.exports = {
    getExtensionPathWithWalk: getExtensionPathWithWalk
};
