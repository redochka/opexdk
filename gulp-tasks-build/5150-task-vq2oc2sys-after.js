module.exports = function (extension) {

    const gulp  = require('gulp');
    const args  = require('yargs').argv;
    const path  = require("path");
    const fs    = require("fs-extra");
    const cu    = require("../gulp-includes/common-utils.js");
    const debug = require('debug')('vq2oc2sys-after');


    /*
     *
     */
    gulp.task('vq2oc2sys-after', function (done) {

        if (!args.vq2oc2sys) {
            debug("vq2oc2sys not asked. Abort!");
            done();
            return;
        }

        const FINAL_FILENAME  = cu.getPublicNameOfDelivery(extension);
        const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);
        const vqmodFolder     = path.join(LEGACY_DIST_DIR, "/upload/vqmod");
        debug("Going to remove: ", vqmodFolder)
        fs.removeSync(vqmodFolder);
        done();
    });
}