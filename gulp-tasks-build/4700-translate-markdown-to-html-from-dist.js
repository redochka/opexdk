module.exports = function (extension) {

    const gulp     = require('gulp');
    const insert   = require('gulp-insert');
    const markdown = require('gulp-markdown');    //it uses marked. See https://github.com/chjj/marked/issues/119 for adding CSS.
    const rename   = require("gulp-rename");
    const cu       = require("../gulp-includes/common-utils.js");
    const fs       = require('fs');
    const path     = require('path');


    gulp.task('translate-markdown-to-html-from-dist', gulp.series('rename-package-for-cloud', function (done) {

        /*
         * Do not inject our readme skeleton if the extension.opexBuilder.readme is false.
         * used in scpm2-for-journal3
         */
        if (extension.opexBuilder && extension.opexBuilder.readme) {
            if ("inject" in extension.opexBuilder.readme) {
                if (extension.opexBuilder.readme.inject === false) {
                    console.log("inject readme file is false. Aborting!");
                    done();
                    return;
                }
            }
        }

        /*
         *
         */
        const FINAL_FILENAME  = cu.getPublicNameOfDelivery(extension);
        const MY_DIST_DIR     = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);


        /*
         *
         */
        //var style              = fs.readFileSync(path.join(__dirname, "../assets/dist_skel/style.css"));
        const distSkeletonPath = cu.getDistSkeletonAbsPath();
        var style = fs.readFileSync(path.join(distSkeletonPath, "style.css"));


        /*
         *
         */
        return gulp.src(path.join(distSkeletonPath, "readme.md"))

            .pipe(markdown())

            .pipe(insert.wrap("<html><head>" +
                "<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />\n" +
                "<style>\n" + style + "</style>" +
                "</head><body>",

                "</body></html>"))
            .pipe(rename(function (path) {
                path.extname = ".html";
            }))
            .pipe(gulp.dest(`${MY_DIST_DIR}/doc`));

    }));

}
