module.exports = function (extension) {

    const gulp    = require('gulp');
    const cheerio = require('gulp-cheerio');
    const cu      = require("../gulp-includes/common-utils.js");
    const fs      = require('fs-extra');

    /**
     *
     */
    //gulp.task('remove-ocmod-ids-from-vqmod', gulp.series('translate-markdown-to-html-from-dist', function () {
    gulp.task('remove-ocmod-ids-from-vqmod', function () {

        const FINAL_FILENAME  = cu.getPublicNameOfDelivery(extension);
        const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

        /*
         *
         */
        fs.removeSync(LEGACY_DIST_DIR + '/ocmod-only');

        /*
         *
         */
        // return gulp.src([LEGACY_DIST_DIR + "/upload/vqmod/**/*"])
        return gulp.src([LEGACY_DIST_DIR + "/upload/vqmod/xml/*"])

            .pipe(cheerio({  //remove ocmod tags from vqmod files.
                run          : function ($, file) {
                    $('code').remove();
                    $('name').remove();
                    $('link').remove();
                },
                parserOptions: {
                    xmlMode: true
                }

            }))
            // .pipe(gulp.dest(LEGACY_DIST_DIR + "/upload/vqmod"));
            .pipe(gulp.dest(LEGACY_DIST_DIR + "/upload/vqmod/xml"));

    });
}
