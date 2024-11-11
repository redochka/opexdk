import gulp from "gulp";
import {cu} from "../gulp-includes/common-utils-ts";
import log from "fancy-log";
import path from "path";
import fs from "fs";
import walk from "walk";
import {SftpSpeaker} from "../lib/utils/sftp-speaker";
import {deployCompiledSftpArgs} from "../lib/utils/args-utils";
import {ExtensionManifestPackaging, ServerConfig} from "../lib/utils/types/opexdk.types";


module.exports = function (extension: ExtensionManifestPackaging) {

  let serverConfig: ServerConfig;

  const loopOverExtensionFilesAndDeleteThemFromSftpServer = function (serverConfig: ServerConfig, sftpSpeaker: {
    connectToSftp?: (callback: any) => ServerConfig;
    uploadFile?: (sourcePath: any, remotePath: any, cb?: any) => void;
    closeConnection?: () => void;
    deleteFile: any;
  }) {

    const args = deployCompiledSftpArgs();
    const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension, args);
    const MY_VQMOD_LEGACY_DIST_FOLDER = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

    const srcArray = [`${MY_VQMOD_LEGACY_DIST_FOLDER}/upload/**/*`];
    log("✔ FTP delete of: %s from: %s", srcArray, serverConfig.host);


    let srcFiles = `${MY_VQMOD_LEGACY_DIST_FOLDER}/upload`;

    let filesToDelete = [];
    /*
     * list files here
     */
    let options = {
      followLinks: false,

      filters: [".git", "node_manifestList"],    // directories with these keys will be skipped

      listeners: {    //need this way of coding to be sync!

        file: function (file, fileStats, next) {

          // console.log(file);

          const relativePath = file.replace(`${MY_VQMOD_LEGACY_DIST_FOLDER}/upload/`, '');

          const myFile = relativePath + "/" + fileStats.name;
          // console.log(myFile);
          filesToDelete.push(myFile);

          next();
        },

        end: function () {

          /*
           * Loop and delete
           */
          for (let i = 0; i < filesToDelete.length; i++) {

            let remoteFileToRemove = serverConfig.remoteDir + filesToDelete[i];
            console.log("★ Removing remote file: " + remoteFileToRemove);

            sftpSpeaker.deleteFile(remoteFileToRemove);
          }
        }
      }
    };

    walk.walkSync(srcFiles, options);
  };

  /**
   *
   */
  let connectToSftpAndRemoveFiles = function (done) {

    const args = deployCompiledSftpArgs();

    if (!args.server) {
      console.error("Missing `server` argument. Aborting!");
      process.exit();
    }

    /*
     *
     */

    const sftpSpeaker = SftpSpeaker();

    serverConfig = sftpSpeaker.connectToSftp(function () {

      const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension, args);
      const MY_VQMOD_LEGACY_DIST_FOLDER = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);
      const srcPath = path.join(MY_VQMOD_LEGACY_DIST_FOLDER, 'upload');

      //TODO
      //novqmod : work in progress
      if (args['exclude-vqmod']) {
        log("✔ VQMOD files won't be deleted. Extension was not deployed. Work in progress");

        let files = fs.readdirSync(srcPath);
        // debug(files);
        return;

      } else {
        log("✔ VQMOD files will be deleted.");
        log("✔ SSH: going to remove files inside: ", srcPath, "from this server: ", serverConfig.host, "at this remoteDir:", serverConfig.remoteDir);
        /*
         * we either use sshUtils or sftpSpeaker. I used sftpSpeaker for now.
         */
        // sshUtils.deleteFile(serverConfig, serverConfig.remoteDir);
        // sshUtils.deleteFile(serverConfig, srcPath);
        loopOverExtensionFilesAndDeleteThemFromSftpServer(serverConfig, sftpSpeaker);
        require("../lib/utils/opexdk-notifier").notify('Compiled extension was deleted successfully.');
      }

      sftpSpeaker.closeConnection();
      done();
    });
  };


  return gulp.task('remove-compiled-sftp', gulp.series('package', connectToSftpAndRemoveFiles));
};