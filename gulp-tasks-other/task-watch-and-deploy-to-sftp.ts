import gulp from "gulp";
import {cu} from "../gulp-includes/common-utils-ts";
import log from "fancy-log";
import watchDir from "./task-watch-and-deploy-to-xxx-common";
import {SftpSpeaker} from "../lib/utils/sftp-speaker";
import {watchSftpArgs} from "../lib/utils/args-utils";
import {ExtensionManifestPackaging, ServerConfig} from "../lib/utils/types/opexdk.types";
import prompt from "prompt";

module.exports = function (extensionManifest: ExtensionManifestPackaging) {

  let sftpSpeaker = SftpSpeaker();

  let defaultOru = "";
  if (extensionManifest.devSpec && extensionManifest.devSpec.watchTask && extensionManifest.devSpec.watchTask.ocmodRefreshUrl) {
    defaultOru = extensionManifest.devSpec.watchTask.ocmodRefreshUrl;
  }

  let serverConfig: ServerConfig;

  /**
   *
   */
  let watchExtensionAndItsDependency = function () {
    log.info("Watching extension and its dependency");

    let dirs = cu.getExtensionAndDepsDirs(extensionManifest);

    dirs.forEach(function (dir) {
      watchDir(dir, serverConfig.remoteDir, sftpSpeaker.uploadFile, defaultOru);
    });
  };

  /**
   *
   */
  gulp.task('watch-sftp', function () {

    /*
     * Get our destination
     */
    serverConfig = sftpSpeaker.connectToSftp();

    const args = watchSftpArgs();

    const startWatch = function () {
      if (args.yes) {
        log("★ yes args passed");
        watchExtensionAndItsDependency();
        return;
      }

      prompt.message = "\n";
      prompt.delimiter = "\n";

      prompt.start();

      prompt.get({
        properties: {
          ocfolder: {
            description: ("Do you confirm oc folder: ").red + (serverConfig.host + ":" + serverConfig.remoteDir).magenta
          }
        }
      }, function (_err, result) {
        if (result.ocfolder==='y') {
          watchExtensionAndItsDependency();
        }
      });
    };

    if (args.deploy) {
      return gulp.series('deploy-compiled-sftp', (done) => {
        log("Done running task deploy-compiled-sftp.");
        startWatch();
        done();
      })((error) => {
        error && console.error(error);
      });

    } else {
      startWatch();
    }

  });

};
