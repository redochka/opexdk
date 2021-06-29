const debug = require('debug')('package');
debug("task-package: loading...");

module.exports = function(extension){

    const gulp     = require('gulp');
    const zip      = require('gulp-zip');
    const cu       = require("../gulp-includes/common-utils.js");


    gulp.task('package', gulp.series('translate-markdown-to-html-from-dist', 'vq2oc2sys', 'vq2oc2sys-after', 'remove-ocmod-ids-from-vqmod', 'copy-doc-folder', function (done) {

        console.log("★ Entering package task");

        const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension);
        const MY_DIST_DIR    = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);

        /*
         *
         */
        const src = MY_DIST_DIR + "/**/*";
        const zzz = cu.getNameOfFullZip(FINAL_FILENAME);
        const dst = cu.getZipsDirAbsPath();

        console.log("★ Src: ", src, " zip filename: ", zzz, " dst: ", dst);
        return gulp.src([src])
                   .pipe(zip(zzz))
                   .pipe(gulp.dest(dst));
    }));

};

debug("task-package: loaded");
