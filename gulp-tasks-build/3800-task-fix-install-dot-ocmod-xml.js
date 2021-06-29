var args = require('yargs').argv;
if (args.vv) console.log("task-package-ocmod: loading...");

module.exports = function (extension) {

    var gulp    = require('gulp');
    var zip     = require('gulp-zip');
    var cu      = require("../gulp-includes/common-utils.js");
    var walk    = require('walkdir');    //we used walk instead of findit because of sync. Sync causes stack error.. node --stack-size=32000 node_modules/gulp/bin/gulp.js
    var path    = require('path');
    var cheerio = require('gulp-cheerio');

    var insert = require('gulp-insert');
    var concat = require('gulp-concat');


    gulp.task('fix-install-dot-ocmod-xml', gulp.series('create-install-dot-ocmod-dot-xml', function (done) {

        /*
         *
         */
        if (!args.ocmod) {
            console.log("ocmod not asked. Abort!");
            done();
            return;
        }


        const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension);
        const MY_BUILD_DIR   = cu.getPathToExtensionBuildFolder(FINAL_FILENAME, extension);
        const MY_DIST_DIR    = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);


        var keepOnlyFirstTagOfDuplicates = function ($, tagName) {

            $(tagName).each(function (index, element) {
                if (index != 0) $(element).remove();
            });
        }


        return gulp.src([MY_BUILD_DIR + "/ocmod-merge/install.xml"], {allowEmpty: true})

            .pipe(cheerio({

                run: function ($, file) {

                    /*
                     * Remove duplicate OCMOD identifier tags.
                     */

                    keepOnlyFirstTagOfDuplicates($, 'id');

                    keepOnlyFirstTagOfDuplicates($, 'version');
                    keepOnlyFirstTagOfDuplicates($, 'author');
                    keepOnlyFirstTagOfDuplicates($, 'code');
                    keepOnlyFirstTagOfDuplicates($, 'name');
                    keepOnlyFirstTagOfDuplicates($, 'link');

                    /*
                     * Rename name to be just the extension name. Otherwise, we will see the extra description i put in vqmod like: controller or admin or view ...
                     */
                    $('name').text(extension.finalName);
                },

                parserOptions: {
                    xmlMode: true
                }
            }))

            .pipe(gulp.dest(MY_BUILD_DIR + "/ocmod-merge"));

    }));

}

if (args.vv) console.log("task-packageocmod: loaded");
