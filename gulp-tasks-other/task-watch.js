module.exports      = function (extension) {

    const gulp       = require('gulp');
    const args       = require('yargs').argv;
    const prompt     = require('prompt');
    const path       = require('path');
    const cu         = require("../gulp-includes/common-utils.js");
    const log        = require('fancy-log');
    const deployer   = require("./task-deploy")(extension);
    const vqmodUtils = require("../lib/utils/vqmod-utils");


    let dist = cu.getPathToVhost(extension);


    /**
     *
     */
    let watchDir = function (dir) {

        if (args.vq2oc2sys) {
            let sourcePath = path.join(dir, '/public/module/vqmod/xml/**/*');
            let targetPath = path.join(dist, 'system');

            gulp.watch(sourcePath, function (cb) {
                vqmodUtils.gulpVqmodToOcmod(gulp, sourcePath, targetPath);
                cb();  //this cb is important. Gulp pff..
            });
        }


        let watcher = gulp.watch(path.join(dir, '/public/module/**/*'));
        watcher.on("change", function (changedFile) {

            log("we must deploy only changed file: ", changedFile);
            if (changedFile.indexOf(".vqmod.xml") > 0 && args.vq2oc2sys) {
                //skip
            } else {
                deployer.copyWithBase(changedFile, path.join(dir, "/public/module"));
            }
        });
        return watcher;
    };


    /**
     *
     */
    let watchExtensionAndItsDependency = function () {

        let dirs = cu.getExtensionAndDepsDirs(extension);

        dirs.forEach(function (dir) {
            watchDir(dir);
        });

    };


    /**
     *
     */
    gulp.task('watch', function () {

        if (args.yes) {
            log("★ yes args passed");
            deployer.deployExtensionAndItsDependency();
            watchExtensionAndItsDependency();
            return;
        }

        prompt.message   = "\n";
        prompt.delimiter = "\n";

        prompt.start();

        prompt.get({
            properties: {
                ocfolder: {
                    description: ("Do you confirm oc folder: ").red + (dist).magenta
                }
            }
        }, function (err, result) {

            if (result.ocfolder === 'y') {
                deployer.deployExtensionAndItsDependency();
                watchExtensionAndItsDependency();
            }

        });
    });
}
