var args = require('yargs').argv;
if (args.vv) console.log("[task-vqmod] loading...");

const path = require('path');
const log  = require("fancy-log");

module.exports = function (extension) {


    let gulp       = require('gulp');
    let gulpif     = require('gulp-if');
    let gulpFilter = require('gulp-filter');
    let cheerio    = require('gulp-cheerio');
    let replace    = require('gulp-replace');
    let cu         = require("../gulp-includes/common-utils.js");
    let fs         = require('fs');


    /**
     * FIXME See release task. This task should commit too.
     *
     * gulp vqmod -m core --admin admin5435
     */
    gulp.task('vqmod', gulp.series('clean', 'create-build-workspace', (done) => {

        console.log("★ Enter VQMOD task");

        const FINAL_FILENAME  = cu.getPublicNameOfDelivery(extension);
        const MY_BUILD_DIR    = cu.getPathToExtensionBuildFolder(FINAL_FILENAME, extension);
        const MY_DIST_DIR     = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);
        const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

        /*
         * Create filter instance inside task function
         */
        var filterToKeepVqmodFilesOnly     = gulpFilter('**/vqmod/xml/**', {restore: true});
        var filterToKeepAdminViewFilesOnly = gulpFilter('**/admin/view/**', {restore: true});

        /*
         *
         */
        var hasCustomAdminFolder = function (file) {
            if (args.admin) {
                console.log("[task-vqmod] ★ Custom admin folder detected. Going to rename VQMOD content.");
                return true;
            }

            return false;
        };

        /*
         *
         */
        const path1 = path.join(__dirname, "../assets/dist_skel/fragment_social.html");
        log("path1: ", path1);
        const social_networks_fragment = fs.readFileSync(path1);

        /*
         *
         */
        const MY_SITE = "https://www.prowebtec.com";
        const AUTHOR  = "support@prowebtec.com − " + MY_SITE;

        console.log("★ Running VQMOD task. Final destination: ", LEGACY_DIST_DIR + "/module");

        /*
         *
         */
        // return gulp.src([MY_BUILD_DIR + "/public/**/*", `!${MY_BUILD_DIR}/public/doc/**`, `!${MY_BUILD_DIR}/public/doc/`, `!${MY_BUILD_DIR}/public/.doc`, `!${MY_BUILD_DIR}/public/doc`, `!${MY_BUILD_DIR}/public/doc{,/**}`, `!${MY_BUILD_DIR}/public/doc/*.*`])
        return gulp.src([MY_BUILD_DIR + "/public/module/**", `!${MY_BUILD_DIR}/public/doc/**`, `!${MY_BUILD_DIR}/public/doc/`, `!${MY_BUILD_DIR}/public/.doc`, `!${MY_BUILD_DIR}/public/doc`, `!${MY_BUILD_DIR}/public/doc{,/**}`, `!${MY_BUILD_DIR}/public/doc/*.*`])

            .pipe(replace("__VERSION__", extension.version, {skipBinary: true}))
            .pipe(replace("__FINAL_NAME__", extension.finalName, {skipBinary: true}))
            .pipe(replace("__VQMOD_VERSION__", "2.6.4", {skipBinary: true}))
            .pipe(replace("__AUTHOR__", AUTHOR, {skipBinary: true}))
            .pipe(replace("__MY_LINK__", MY_SITE, {skipBinary: true}))
            //↓
            .pipe(filterToKeepVqmodFilesOnly)
            .pipe(gulpif(hasCustomAdminFolder, replace("admin/", args.admin + "/", {skipBinary: true})))
            .pipe(filterToKeepVqmodFilesOnly.restore)
            //↓
            .pipe(filterToKeepAdminViewFilesOnly)
            .pipe(replace("<!-- include_social_networks_fragment_b0c4d -->", social_networks_fragment, {skipBinary: true}))
            .pipe(filterToKeepAdminViewFilesOnly.restore)
            .pipe(gulp.dest(LEGACY_DIST_DIR + "/module"));

    }));

};

if (args.vv) console.log("[task-vqmod] loaded");
