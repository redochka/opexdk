var args    = require('yargs').argv;
if(args.vv) console.log("[task-renameadmin] loading...");

module.exports = function(extension){

    var gulp    = require('gulp');
    //var shell = require('gulp-shell');    //used to rename admin directory to something else if requested.
    var shell   = require('shelljs');
    var cu      = require("../gulp-includes/common-utils.js");

    gulp.task('renameadmin', gulp.series('vqmod', function (done) {
        if(args.admin){

            const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension);
            const LEGACY_DIST_DIR= cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);


            var olddst = LEGACY_DIST_DIR + "/module/" + "admin";
            var newdst = LEGACY_DIST_DIR + "/module/" +  args.admin;

            shell.mv(olddst, newdst);
        }

        done();
    }));

}

if(args.vv) console.log("[task-renameadmin] loaded");
