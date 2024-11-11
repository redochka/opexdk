import gulp from "gulp";
import insert from "gulp-insert";
import markdown from "gulp-markdown";    //it uses marked. See https://github.com/chjj/marked/issues/119 for adding CSS.
import rename from "gulp-rename";
import {cu} from "../gulp-includes/common-utils-ts";
import {argv as args} from "yargs";

module.exports = function (extension) {
  gulp.task('markdown', gulp.series('renameadmin', function () {

    /*
     *
     */
    const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension, args);
    const MY_DIST_DIR = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);
    const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);


    /*
     *
     */
    var readme = LEGACY_DIST_DIR + "/readme.md";
    console.log("★ Creating a copy of the readme: " + readme + " as HTML and copying it to: " + LEGACY_DIST_DIR);

    /*
     *
     */
    return gulp.src(readme, {allowEmpty: true})
      .pipe(insert.prepend("<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />\n"))
      .pipe(markdown())
      .pipe(rename(function (path) {
        path.extname = ".html";
      }))
      .pipe(gulp.dest(LEGACY_DIST_DIR));

  }));

}