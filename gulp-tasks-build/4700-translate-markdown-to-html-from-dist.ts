import gulp from "gulp";
import insert from "gulp-insert";
import markdown from "gulp-markdown";    //it uses marked. See https://github.com/chjj/marked/issues/119 for adding CSS.
import rename from "gulp-rename";
import {cu} from "../gulp-includes/common-utils-ts";
import fs from "fs";
import path from "path";
import {argv as args} from "yargs";
import {ExtensionManifestPackaging} from "../lib/utils/types/opexdk.types";


module.exports = function (extension: ExtensionManifestPackaging) {
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
        const FINAL_FILENAME  = cu.getPublicNameOfDelivery(extension, args);
        const MY_DIST_DIR     = cu.getPathToExtensionDistFolder2(FINAL_FILENAME, extension.private_dist_dir);


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
