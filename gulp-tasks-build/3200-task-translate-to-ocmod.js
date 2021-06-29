const debug = require('debug')('translateVqmodToOcmod');
debug("Loading task definition".grey);

module.exports = function (extension) {


    /*
     * See OCMOD documentation:
     * http://forum.opencart.com/viewtopic.php?f=24&t=131995
     *
     * [VQMOD]
     * id, version, author, vqmver
     *
     * [OCMOD]
     * id, version, author, code, name, link
     *
     * Remove vqmver tag from OCMOD files
     *
     * Note that:
     * VQMOD files from the source (and not from the dist) are used.
     * OCMOD files are output in the dist folder.
     */

    const gulp       = require('gulp');
    const args       = require('yargs').argv;
    const path       = require("path");
    const cu         = require("../gulp-includes/common-utils.js");
    const vqmodUtils = require("../lib/utils/vqmod-utils");

    /*
     *
     */
    gulp.task('translate-to-ocmod', gulp.series('rename-module-to-upload', function (done) {

        if (!args.ocmod) {
            debug("ocmod not asked. Abort!");
            done();
            return;
        }

        /*
         * Translate VQMOD into OCMOD
         */
        const FINAL_FILENAME  = cu.getPublicNameOfDelivery(extension);
        const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

        const sourcePath = path.join(LEGACY_DIST_DIR, "/upload/vqmod/**/*");
        const targetPath = path.join(LEGACY_DIST_DIR, "/compatibility/ocmod");
        return vqmodUtils.gulpVqmodToOcmod(gulp, sourcePath, targetPath);
    }));
}

debug("Loaded".grey);