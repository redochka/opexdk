/**
 * We use vinyl-ftp whereas somewhere else in task-watch-and-deploy-to-ftp.js we use another ftp module.
 * Vinyl-ftp seems better.
 *
 *
 * NOT TESTED !!!!
 */
module.exports = function (extension) {

    const gulp = require('gulp');
    const args = require('yargs').argv;
    const cu   = require("../gulp-includes/common-utils.js");
    const ftp  = require('vinyl-ftp');    //formerly known as gulp-ftp
    const path = require('path');
    const log  = require('fancy-log');

    const walk = require('walk');    //we used walk instead of findit because of sync. Sync causes stack error.. node --stack-size=32000 node_modules/gulp/bin/gulp.js

    /**
     * Deploy from the dist folder. This method should be called after a `vqmod`
     */
    const removeModuleFtp = function (ftpConf) {

        const FINAL_FILENAME              = cu.getPublicNameOfDelivery(extension);
        const MY_VQMOD_LEGACY_DIST_FOLDER = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

        const srcArray = [`${MY_VQMOD_LEGACY_DIST_FOLDER}/upload/**/*`];
        log("✔ SFTP delete of: %s from: %s", srcArray, ftpConf.host);

        return;

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

                    ftpConf.password = ftpConf.pass;
                    // ftpConf.parallel = 20;
                    // ftpConf.parallel = 10;
                    ftpConf.log = log;    //enable log

                    let conn = ftp.create(ftpConf);

                    /*
                     * Loop and delete
                     */
                    for (let i = 0; i < filesToDelete.length; i++) {

                        let remoteFileToRemove = ftpConf.remoteDir + filesToDelete[i];
                        console.log("★ Removing remote file: " + remoteFileToRemove);

                        // conn.delete(remoteFileToRemove, function (err) {
                        //     if (err) throw err;
                        // });
                    }
                }
            }
        };

        walk.walkSync(srcFiles, options);
    };


    /**
     *  Client remove files from remote server
     *  gulp remove-compiled-ftp -m extension123 --server example.ftp.xml --exclude-vqmod
     */
    return gulp.task('remove-compiled-sftpXXX', gulp.series('package', function () {

        /*
         *
         */
        let serverConfigFile = args.server;

        /*
         * load server connexion config
         */
        let serverConfigLoader = require('../my-helpers/load-server-config-from-filezilla-format');
        let serverConfig       = serverConfigLoader.getFtpConfigUsingPixlXml(serverConfigFile);

        return removeModuleFtp(serverConfig);

    }));

}
