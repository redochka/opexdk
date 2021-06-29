var args    = require('yargs').argv;
if(args.vv) console.log("[task-markdown] loading...");

module.exports = function(extension){

    const gulp     = require('gulp');
    const insert   = require('gulp-insert');
    const markdown = require('gulp-markdown');    //it uses marked. See https://github.com/chjj/marked/issues/119 for adding CSS.
    const path     = require('path');
    const rename   = require("gulp-rename");
    const cu       = require("../gulp-includes/common-utils.js");


    gulp.task('markdown', gulp.series('renameadmin', function () {

        /*
         *
         */
        const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension);
        const MY_DIST_DIR    = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);
        const LEGACY_DIST_DIR= cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);


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

if(args.vv) console.log("[task-markdown] loaded");
