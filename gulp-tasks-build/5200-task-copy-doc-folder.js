module.exports = function(extension){

    const gulp    = require('gulp');
    const cu      = require("../gulp-includes/common-utils.js");


    gulp.task('copy-doc-folder', function (done) {

        const FINAL_FILENAME  = cu.getPublicNameOfDelivery(extension);
        const MY_DIST_DIR     = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);
        const MY_BUILD_DIR    = cu.getPathToExtensionBuildFolder(FINAL_FILENAME, extension);
        const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

        console.log("★ Going to copy doc folder");
        return gulp.src([MY_BUILD_DIR + "/public/doc/**"])
            .pipe(gulp.dest(MY_DIST_DIR + "/doc"));
    });

}
