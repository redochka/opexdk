const debug = require('debug')('translate-to-vqmod');
debug("task-vqmod-to-vqmod: loading");

/*
 * This task is not meant for the usual process
 * it's to be run independently.
 * opexdk translate-to-vqmod --path /path/to/vqmod/folder
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
    const ocmodUtils = require("../lib/utils/ocmod-utils");

    /*
     *
     */
    gulp.task('translate-to-vqmod', function () {

        const sourcePath = path.join(path.join(args.path, "/**/*"));
        const targetPath = args.path;
        return ocmodUtils.gulpOcmodToVqmod(gulp, sourcePath, targetPath);
    });
}

debug("Loaded".grey);
