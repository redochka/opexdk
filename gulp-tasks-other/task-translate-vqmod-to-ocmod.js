const debug = require('debug')('translate-to-ocmod');
debug("task-vqmod-to-ocmod: loading");

/*
 * This task is not meant for the usual process
 * it's to be run independently.
 */

module.exports = function () {


    /*
     * See OCMOD documentation:
     * http://forum.opencart.com/viewtopic.php?f=24&t=131995
     * 
     * [VQMOD]
     * id, version, author, vqmver
     *     
     * [OCMOD]
     * id, version, author, code, name, link
     */

    const gulp       = require('gulp');
    const args       = require('yargs').argv;
    const path       = require("path");
    const vqmodUtils = require("../lib/utils/vqmod-utils");

    /*
     *
     */
    gulp.task('translate-to-ocmod', function () {

        const sourcePath = path.join(path.join(args.path, "/**/*"));
        const targetPath = args.path;
        return vqmodUtils.gulpVqmodToOcmod(gulp, sourcePath, targetPath);
    });
}

debug("Loaded".grey);