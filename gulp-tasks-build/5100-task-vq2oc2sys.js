module.exports = function (extension) {

    const gulp       = require('gulp');
    const args       = require('yargs').argv;
    const path       = require("path");
    const cu         = require("../gulp-includes/common-utils.js");
    const vqmodUtils = require("../lib/utils/vqmod-utils");
    const debug      = require('debug')('vq2oc2sys');

    /*
     *
     */
    gulp.task('vq2oc2sys', function (done) {

        if (!args.vq2oc2sys) {
            debug("vq2oc2sys not asked. Abort!");
            done();
            return;
        }

        /*
         * Translate VQMOD into OCMOD
         */
        const FINAL_FILENAME  = cu.getPublicNameOfDelivery(extension);
        const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

        const sourcePath = path.join(LEGACY_DIST_DIR, "/upload/vqmod/xml/**/*");
        const targetPath = path.join(LEGACY_DIST_DIR, "/upload/system");
        return vqmodUtils.gulpVqmodToOcmod(gulp, sourcePath, targetPath);
    });
}