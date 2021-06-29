var args = require('yargs').argv;
if(args.vv) console.log("task-clean: loading...");

module.exports = function(extension){

    console.log("extensions: ", extension);

    var gulp    = require('gulp');
    var fs      = require("fs-extra");
    var cu      = require("../gulp-includes/common-utils.js");

    /*
     *
     */
    gulp.task('clean', function (done) {

        const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension);
        const MY_BUILD_DIR   = cu.getPathToExtensionBuildFolder(FINAL_FILENAME, extension);
        const MY_DEST_DIR    = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);

        /*
         *
         */
        console.warn("✔ Deleting any old generated folder in the build dir: ".red, MY_BUILD_DIR);
        fs.removeSync(MY_BUILD_DIR);

        /*
         *
         */
        console.warn("✔ Deleting any old generated folder in the dest dir: ".red, MY_DEST_DIR);
        fs.removeSync(MY_DEST_DIR);

        done();
        console.log("★ cleaning done");
    });

};


if(args.vv) console.log("task-clean: loaded");
