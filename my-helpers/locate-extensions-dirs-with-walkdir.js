const walkdir = require('walkdir');    //we used walk instead of findit because of sync. Sync causes stack error.. node --stack-size=32000 node_modules/gulp/bin/gulp.js
const path    = require('path');
const fs      = require('fs');
const log     = require('fancy-log');
const debug   = require('debug')('walkdir');

const getExtensionsPathsWithWalk = function () {

    //result
    let extensionsDirs = [];


    const options = {
        "max_depth": 4
    };

    const callback = function (mypath, stat) {
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
         * check if manifest exists and load shortname
         */
        let manifestPath = mypath + "/manifest.json";
        if (fs.existsSync(manifestPath)) {
            debug("[walker-task] manifest.json found. Going to collect its path".green);
            extensionsDirs.push(mypath);
            debug(`[walker-task] Total Extension paths found: ${extensionsDirs.length}.`.green);
        }
    };

    let homeEnv = process.env.OPEXDK_SRC_PATH;
    debug("★ homeEnv: ", homeEnv);
    let homes = homeEnv.split(",");
    for (const home of homes) {
        debug(home);
        walkdir.sync(home, options, callback);
    }
    return extensionsDirs;
};


module.exports = {
    getExtensionsPathsWithWalk: getExtensionsPathsWithWalk
};
