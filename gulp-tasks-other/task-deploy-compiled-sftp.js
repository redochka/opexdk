const debug = require("debug")("deploy-compiled-sftp");
debug("Loading task definition".grey);

module.exports = function (extension) {

    const gulp = require('gulp');
    const cu   = require("../gulp-includes/common-utils.js");
    const log  = require('fancy-log');
    const path = require('path');
    const sftp = require('../lib/utils/scp-speaker');
    const args = require('yargs').argv;

    let serverConfig;

    /**
     *
     */
    let deployExtensionAndItsDependencyToSftp = function (done) {

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
        serverConfig           = serverConfigLoader.getFtpConfigUsingPixlXml(serverConfigFile);

        /*
         *
         */
        const FINAL_FILENAME              = cu.getPublicNameOfDelivery(extension);
        const MY_VQMOD_LEGACY_DIST_FOLDER = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);
        const srcPath                     = path.join(MY_VQMOD_LEGACY_DIST_FOLDER, 'upload');

        log("✔ SFTP deploy from: %s to: %s", srcPath, serverConfig.host);
        sftp.uploadFile(srcPath, serverConfig.remoteDir, serverConfig);

        done();
    };


    gulp.task('deploy-compiled-sftp', gulp.series('package', deployExtensionAndItsDependencyToSftp));


    /* 13/11/2020 is this needed?
        return {
            uploadFile
        };
    */

};

debug("Loaded".grey);
