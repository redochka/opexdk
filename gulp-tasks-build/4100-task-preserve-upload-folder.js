var args    = require('yargs').argv;
if(args.vv) console.log("task-package-ocmod: loading...");

module.exports = function(extension){

    const gulp = require('gulp');
    const cu   = require("../gulp-includes/common-utils.js");
    const path = require("path");


    gulp.task('preserve-upload-folder', gulp.series('fix-install-dot-ocmod-xml', function (done) {

        /*
         *
         */
        if(!args.ocmod) {
            console.log("ocmod not asked. Abort!");
            done();
            return;
        }


        const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension);
        const MY_BUILD_DIR   = cu.getPathToExtensionBuildFolder(FINAL_FILENAME, extension);
        const LEGACY_DIST_DIR= cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

        let excludedVqmod = path.normalize(`!${LEGACY_DIST_DIR}/upload/vqmod/**`);
        console.log("Going to exclude: ", excludedVqmod);

        return gulp.src([
            LEGACY_DIST_DIR + "/upload/**/*",
            excludedVqmod,
        ])
        .pipe(gulp.dest(MY_BUILD_DIR + "/ocmod-merge/wrapper-of-upload/upload"));

    }));
};

if(args.vv) console.log("task-package-ocmod: loaded");
