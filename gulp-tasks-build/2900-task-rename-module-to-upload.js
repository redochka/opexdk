const args    = require('yargs').argv;
if(args.vv) console.log("[task-rename-module-to-upload] loading...");

module.exports = function(extension){

    const gulp    = require('gulp');
    const cu      = require("../gulp-includes/common-utils.js");
    const shell   = require('shelljs');


    gulp.task('rename-module-to-upload', gulp.series('markdown', function (done) {

        const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension);
        const MY_DIST_DIR    = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);
        const LEGACY_DIST_DIR= cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);


        var olddst = LEGACY_DIST_DIR + "/module/" ;
        var newdst = LEGACY_DIST_DIR + "/upload/" ;

        shell.mv(olddst, newdst);

        done();
    }));

}

if(args.vv) console.log("[task-rename-module-to-upload] loaded");
