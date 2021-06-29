let args = require('yargs').argv;

/**
 *
 */
module.exports = function (extension) {

    const gulp       = require('gulp');
    const gulpIgnore = require('gulp-ignore');
    const gulpif     = require('gulp-if');
    const cu         = require("../gulp-includes/common-utils.js");
    const fs         = require('fs-extra')
    const log        = require('fancy-log');
    const path       = require('path');
    const vqmodUtils = require("../lib/utils/vqmod-utils");

    let dist = cu.getPathToVhost(extension);

    /**
     *
     */
    let copySync = function (sourcePath) {

        if (sourcePath.indexOf('coca') > 0) {
            log.info("★ coca is present in the path. sourcePath: ", sourcePath);

            sourcePath      = sourcePath + "common/";
            let catalogPath = dist + "/catalog";
            let adminPath   = dist + "/admin";

            log.info("★ Going to copy sourcePath: ", sourcePath, " to ", catalogPath);
            fs.copySync(sourcePath, catalogPath);

            log.info("★ Going to copy sourcePath: ", sourcePath, " to ", adminPath);
            fs.copySync(sourcePath, adminPath);
        } else {
            log.info("★ Copying %s to %s", (sourcePath).magenta, (dist).magenta);
            fs.copySync(sourcePath, dist);
        }

    };


    /**
     *
     */
    let copyWithBase = function (sourcePath, base) {

        if (sourcePath.indexOf('coca') > 0 && sourcePath.indexOf('/common/' > 0)) {
            log.info("★ coca is present in the path. sourcePath: ", sourcePath);

            base = base + "/common";

            const catalogDist = dist + "/catalog";
            log.info("★ Going to copy: ", sourcePath, " to ", catalogDist, " using base: ", base);
            gulp.src(sourcePath, {"base": base}).pipe(gulp.dest(catalogDist));

            const adminDist = dist + "/admin";
            log.info("★ Going to copy: ", sourcePath, " to ", adminDist, " using base: ", base);
            return gulp.src(sourcePath, {"base": base}).pipe(gulp.dest(adminDist));

        } else {
            log.info("Copying %s to %s", (sourcePath).magenta, (dist).magenta);
            return gulp.src(sourcePath, {"base": base}).pipe(gulp.dest(dist));
        }

    };


    /**
     *
     */
    let deployExtensionUsingGulp = function (dir) {
        gulp.src(path.join(dir, 'public/module/**/*'), {buffer: false})
            .pipe(gulpif(args['exclude-vqmod'] || args.vq2oc2sys, gulpIgnore.exclude("**/vqmod/xml/**")))
            .pipe(gulp.dest(dist));

        if (args.vq2oc2sys) {
            let sourcePath = path.join(dir, 'public/module/vqmod/xml/**/*');
            let targetPath = path.join(dist, 'system');
            vqmodUtils.gulpVqmodToOcmod(gulp, sourcePath, targetPath);
        }
    };

    let deployExtensionUsingFs = function (dir) {
        return copySync(dir + '/public/module/');
    };


    let deployExtensionAndItsDependency = function (done) {

        let dirs = cu.getExtensionAndDepsDirs(extension);
        dirs.forEach(function (dir) {
            //deployExtensionUsingFs(dir);
            deployExtensionUsingGulp(dir);
        });

        if (done) done();
    };


    /**
     *
     */
    gulp.task('deploy', deployExtensionAndItsDependency);


    return {
        copyWithBase,
        deployExtensionAndItsDependency
    }

};