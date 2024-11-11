import gulp from "gulp";
import {cu} from "../gulp-includes/common-utils-ts";
import log from "fancy-log";
import watchDir from "./task-watch-and-deploy-to-xxx-common";
import {SftpSpeaker} from "../lib/utils/sftp-speaker";
import {watchSftpArgs} from "../lib/utils/args-utils";
import {ExtensionManifestPackaging, ServerConfig} from "../lib/utils/types/opexdk.types";
import prompt from "prompt";

module.exports = function (extension: ExtensionManifestPackaging) {

    let sftpDeployer = SftpSpeaker();

    let defaultOru = "";
    if(extension.devSpec && extension.devSpec.watchTask && extension.devSpec.watchTask.ocmodRefreshUrl){
        defaultOru = extension.devSpec.watchTask.ocmodRefreshUrl;
    }

    let serverConfig: ServerConfig;

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

        const args = watchSftpArgs();

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
            }, function (_err, result) {
                if (result.ocfolder === 'y') {
                    watchExtensionAndItsDependency();
                }
            });
        }


    });

};
