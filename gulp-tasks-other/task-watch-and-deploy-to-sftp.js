const {argv: args} = require("yargs");
const log = require("fancy-log");
const prompt = require("prompt");
module.exports = function (extension) {

    const gulp            = require('gulp');
    const args            = require('yargs').argv;
    const prompt          = require('prompt');
    const cu              = require("../gulp-includes/common-utils.js");
    const log             = require('fancy-log');
    const watchDir        = require('./task-watch-and-deploy-to-xxx-common');
    let sftpDeployer = require("./sftp/deploy-single-file")(extension);

    let defaultOru = "";
    if(extension.devSpec && extension.devSpec.watchTask && extension.devSpec.watchTask.ocmodRefreshUrl){
        defaultOru = extension.devSpec.watchTask.ocmodRefreshUrl;
    }
    let serverConfig;

    /**
     *
     */
    let watchExtensionAndItsDependency = function () {
        log.info("Watching extension and its dependency");

        let dirs = cu.getExtensionAndDepsDirs(extension);

        dirs.forEach(function (dir) {
            watchDir(dir, serverConfig.remoteDir, sftpDeployer.uploadFile, defaultOru);
        });

    };


    /**
     *
     */
    gulp.task('watch-sftp', function () {

        /*
         * Get our destination
         */
        serverConfig = sftpDeployer.connectToSftp(()=>{
        });

        if (args.yes) {
            log("★ yes args passed");
            watchExtensionAndItsDependency();
        } else {
            prompt.message   = "\n";
            prompt.delimiter = "\n";

            prompt.start();

            prompt.get({
                properties: {
                    ocfolder: {
                        description: ("Do you confirm oc folder: ").red + (serverConfig.host + ":" + serverConfig.remoteDir).magenta
                    }
                }
            }, function (err, result) {
                if (result.ocfolder === 'y') {
                    watchExtensionAndItsDependency();
                }
            });
        }


    });

};
