module.exports = function (extension) {

    const gulp  = require('gulp');
    const cu    = require("../gulp-includes/common-utils.js");
    const sftp  = require('../lib/utils/scp-speaker');
    const args  = require('yargs').argv;

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
        const serverConfig     = serverConfigLoader.getFtpConfigUsingPixlXml(serverConfigFile);


        /*
         *
         */
        let dirs = cu.getExtensionAndDepsDirs(extension);
        dirs.forEach(function (dir) {
            dir = dir + "/public/module/";
            sftp.uploadFile(dir, serverConfig.remoteDir, serverConfig, function () {
                require('../lib/utils/opexdk-notifier').notify("Extension deployed to SFTP server");
                done();
            });
        });
    };


    return gulp.task('deploy-sftp', gulp.series(deployExtensionAndItsDependencyToSftp));
};
