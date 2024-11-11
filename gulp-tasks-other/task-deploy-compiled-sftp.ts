import gulp from "gulp";
import {cu} from "../gulp-includes/common-utils-ts";
import log from "fancy-log";
import path from "path";
import {uploadFile} from "../lib/utils/scp-speaker";
import {deployCompiledSftpArgs} from "../lib/utils/args-utils";
import {ExtensionManifestPackaging, ServerConfig} from "../lib/utils/types/opexdk.types";
import 'colorts/lib/string';

module.exports = function (extension: ExtensionManifestPackaging) {

  let serverConfig: ServerConfig;

  /**
   *
   */
  let deployExtensionAndItsDependencyToSftp = function (done: () => void) {

    const args = deployCompiledSftpArgs();

    if (!args.server) {
      console.error("Missing `server` argument. Aborting!");
      process.exit();
    }

    /*
     *
     */
    let serverConfigFile = args.server;

    /*
     * load server connexion config
     */
    let serverConfigLoader = require('../my-helpers/load-server-config-from-filezilla-format');
    serverConfig = serverConfigLoader.getFtpConfigUsingPixlXml(serverConfigFile);

    /*
     *
     */
    const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension, args);
    const MY_VQMOD_LEGACY_DIST_FOLDER = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);
    const srcPath = path.join(MY_VQMOD_LEGACY_DIST_FOLDER, 'upload');

    log("✔ SFTP deploy from: %s to: %s".yellow, srcPath, serverConfig.host);
    uploadFile(srcPath, serverConfig.remoteDir, serverConfig, null);

    done();
  };


  gulp.task('deploy-compiled-sftp', gulp.series('package', deployExtensionAndItsDependencyToSftp));
};