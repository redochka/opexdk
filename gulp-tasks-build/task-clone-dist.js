var args    = require('yargs').argv;
if(args.vv) console.log(("Loading " + __filename).grey);

module.exports = function(extension){

    var gulp     = require('gulp');
    var zip      = require('gulp-zip');
    var cu       = require("../gulp-includes/common-utils.js");

    gulp.task('clone-dist', gulp.series('task-package', function () {

        const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension);
        const MY_DIST_DIR    = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);


        /*
         *
         */
        return gulp.src(["./assets/dist_skel" + "/**/*"])
//                   .pipe(zip(FINAL_FILENAME + '.zip'))
                   .pipe(gulp.dest(MY_DIST_DIR));
    }));

}

if(args.vv) console.log("task-package: loaded");
