module.exports = function (extension) {

    const gulp  = require('gulp');
    const path  = require('path');
    const fs    = require("fs-extra");
    const cu    = require("../gulp-includes/common-utils.js");
    const log   = require('fancy-log');
    const debug = require("debug")("create-build-workspace");

    /*
     *
     */
    gulp.task('create-build-workspace', function (done) {

        const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension);
        const MY_BUILD_DIR   = cu.getPathToExtensionBuildFolder(FINAL_FILENAME, extension);

        debug("★ Build Workspace created");

        /*
         * Copy files from lib and extension to build workspace
         */
        const dirs = cu.getExtensionAndDepsDirs(extension);

        dirs.forEach(function (dir) {

            if (dir.indexOf('!') >= 0) {
                debug("★ dir contains ! so exclude from copy. dir is: ", dir);

            } else if (dir.indexOf('-coca') > 0) {

                let cocaSrc    = path.join(dir, "/public/module/common/");
                let catalogDst = path.join(MY_BUILD_DIR, "/public/module/catalog");
                fs.copySync(cocaSrc, catalogDst);
                //gulp.src(src).pipe(gulp.dest(catalogDst));

                // gulp.src(cocaSrc).pipe(gulp.dest(adminDst));
                let adminDst = path.join(MY_BUILD_DIR, "/public/module/admin");
                fs.copySync(cocaSrc, adminDst);

            } else {
                // gulp.src(dir + "/**/*").pipe(gulp.dest(MY_BUILD_DIR));
                log(`★ Going to copy ${dir} to ${MY_BUILD_DIR}`);
                fs.copySync(dir, MY_BUILD_DIR);
            }
        });

        //remove the system-gen folder
        fs.removeSync(path.join(MY_BUILD_DIR, "/public/module/system-gen"));

        done();
        debug("★ build workspace done");
    });
}