const debug = require("debug")("deploy-compiled-sftp");
debug("Loading task definition".grey);

module.exports = function (extension) {

    const gulp = require('gulp');
    const cu   = require("../gulp-includes/common-utils.js");
    const log  = require('fancy-log');
    const path = require('path');
    const sshUtils = require('../lib/utils/ssh-utils');
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

        //TODO
        //novqmod : work in progress
        if (args['exclude-vqmod']) {
            log("✔ VQMOD files won't be uploaded. Extension was not deployed. Work in progress");

            let files = fs.readdirSync(srcPath);
            debug(files);
            return;

        } else {
            log("✔ VQMOD files will be uploaded.");

            log("✔ SSH: going to remove: ", srcPath, "from this server: ", serverConfig.host, "at this remoteDir:", serverConfig.remoteDir);
            // sshUtils.deleteFile(serverConfig, serverConfig.remoteDir);
            sshUtils.deleteFile(serverConfig, srcPath);

            require("../lib/utils/opexdk-notifier").notify('Compiled extension was uploaded successfully.');
        }

        done();
    };


    gulp.task('remove-compiled-sftp', gulp.series('package', deployExtensionAndItsDependencyToSftp));


    /* 13/11/2020 is this needed?
        return {
            uploadFile
        };
    */

};

debug("Loaded".grey);
