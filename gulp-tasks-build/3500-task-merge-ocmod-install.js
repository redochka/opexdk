var args = require('yargs').argv;
if (args.vv) console.log("task-package-ocmod: loading...");

module.exports = function (extension) {

    const gulp    = require('gulp');
    const cu      = require("../gulp-includes/common-utils.js");
    const cheerio = require('gulp-cheerio');

    const insert = require('gulp-insert');
    const concat = require('gulp-concat');


    gulp.task('create-install-dot-ocmod-dot-xml', gulp.series('translate-to-ocmod', function (done) {

        if (!args.ocmod) {
            console.log("ocmod not asked. Abort!");
            done();
            return;
        }


        const FINAL_FILENAME  = cu.getPublicNameOfDelivery(extension);
        const MY_BUILD_DIR    = cu.getPathToExtensionBuildFolder(FINAL_FILENAME, extension);
        const MY_DIST_DIR     = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);
        const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);
        const OCMOD_DIST_DIR  = cu.getPathToExtensionOcmodDistFolder(FINAL_FILENAME, extension);


        var indent = "    ";

        return gulp.src([LEGACY_DIST_DIR + "/compatibility/ocmod/**/*"])

            .pipe(cheerio({

                run: function ($, file) {

                    var wantedTags = [];

                    wantedTags.push(indent + $('id'));
                    wantedTags.push(indent + $('version'));
                    wantedTags.push(indent + $('author'));
                    wantedTags.push(indent + $('code'));
                    wantedTags.push(indent + $('name'));
                    wantedTags.push(indent + $('link'));

                    $('file').each(function () {
                        var qFile = $(this);
                        wantedTags.push(indent + qFile);
                    });

                    var newXml        = wantedTags.join('\n\n');
                    var $modification = $('modification');
                    $modification.replaceWith(newXml);

                    wantedTags = [];

                },

                parserOptions: {
                    xmlMode: true
                }


            }))

            .pipe(concat('install.xml'))

            .pipe(insert.prepend("<modification>\n\n"))

            .pipe(insert.append("\n\n</modification>"))


            .pipe(gulp.dest(MY_BUILD_DIR + "/ocmod-merge"));

    }));

}

if (args.vv) console.log("task-packageocmod: loaded");
