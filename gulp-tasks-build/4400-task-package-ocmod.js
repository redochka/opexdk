module.exports = function (extension) {

    const args   = require('yargs').argv;
    const gulp   = require('gulp');
    const zip    = require('gulp-zip');
    const cu     = require("../gulp-includes/common-utils.js");
    const fs     = require("fs");
    const path   = require("path");
    const rename = require("gulp-rename");

    gulp.task('package-ocmod', gulp.series('preserve-upload-folder', function (done) {

        /*
         *
         */
        if (!args.ocmod) {
            console.log("★ `ocmod` flag was not specified. Abort!");
            done();
            return;
        }


        const FINAL_FILENAME  = cu.getPublicNameOfDelivery(extension);
        const MY_BUILD_DIR    = cu.getPathToExtensionBuildFolder(FINAL_FILENAME, extension);
        const MY_DIST_DIR     = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);
        const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);
        const OCMOD_DIST_DIR  = cu.getPathToExtensionOcmodDistFolder(FINAL_FILENAME, extension);

        //var myfile = fs.readFileSync(MY_BUILD_DIR + "/ocmod-merge/install.xml");
        //console.log("myfile: ", myfile.toString());
        /*
         * because of double zip happening later, quick open to view in gnome will show the install.xml as truncated.
         * you must unzip completely the both archive to avoid the bug.
         */


        // if (!fs.existsSync(MY_BUILD_DIR + "/ocmod-merge/wrapper-of-upload")) {
        if (!fs.existsSync(path.join(MY_BUILD_DIR, "/ocmod-merge/wrapper-of-upload"))) {

            console.log("★ This extension has no PHP or template files");

            /*
             * Generate simple extension_name.ocmod.xml
             */
            return gulp.src(path.join(MY_BUILD_DIR, "/ocmod-merge/install.xml"), {allowEmpty: true})
                .pipe(rename(function (path) {
                    // path.dirname += "/ciao";
                    path.basename = FINAL_FILENAME;
                    path.extname  = ".ocmod.xml";
                }))
                .pipe(gulp.dest(OCMOD_DIST_DIR))

        } else {

            console.log("★ Generate full OCMOD package.");

            // let excludedVqmod = path.normalize(`!${MY_BUILD_DIR}/ocmod-merge/wrapper-of-upload/upload/vqmod`);
            return gulp.src([
                path.join(MY_BUILD_DIR, "/ocmod-merge/install.xml"),
                path.join(MY_BUILD_DIR, "/public/ocmod-only/install.php"),
                path.join(MY_BUILD_DIR, "/ocmod-merge/wrapper-of-upload/**/*"),
            ], {
                allowEmpty: true,
            }).pipe(zip(FINAL_FILENAME + '.ocmod.zip'))
                .pipe(gulp.dest(OCMOD_DIST_DIR));
        }
    }));
};