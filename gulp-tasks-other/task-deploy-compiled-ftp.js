/**
 * We use vinyl-ftp where as somewhere else in task-watch-and-deploy-to-ftp.js we use an other ftp module.
 * Vinyl-ftp seems better.
 */
module.exports = function (extension) {

    const gulp       = require('gulp');
    const cu         = require("../gulp-includes/common-utils.js");
    const args       = require('yargs').argv;
    const gulpIgnore = require('gulp-ignore');
    const gulpif     = require('gulp-if');
    const ftp        = require('vinyl-ftp');    //formerly known as gulp-ftp
    const log        = require('fancy-log');


    const ftpNotifier = {
        'on'   : function (x) {
            //console.log("inside on");
        },
        'once' : function (x) {
            //console.log("inside once");
        },
        'emit' : function (x) {
            //console.log("inside emit");
        },
        'write': function (x) {
            //console.log("inside write");
        },
        'end'  : function (x) {
            require('../lib/utils/opexdk-notifier').notify('File uploaded successfully to FTP')
        },
    };


    /**
     * Deploy from the dist folder. This method should be called after a `vqmod`
     */
    const deployModuleFtp = function (serverConfig, done) {

        const FINAL_FILENAME              = cu.getPublicNameOfDelivery(extension);
        const MY_VQMOD_LEGACY_DIST_FOLDER = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

        const srcArray = [`${MY_VQMOD_LEGACY_DIST_FOLDER}/upload/**/*`];
        log("✔ FTP deploy from: %s to: %s", srcArray, serverConfig.host);

        serverConfig.password = serverConfig.pass;
        // serverConfig.parallel = 20;
        // serverConfig.parallel = 10;
        serverConfig.log = log;    //enable log

        const conn = ftp.create(serverConfig);

        if (args['exclude-vqmod']) {
            log("✔ VQMOD files won't be uploaded.");
        } else {
            log("✔ VQMOD files will be uploaded.");
        }

        gulp.src(srcArray, {buffer: false})
            .pipe(gulpif(args['exclude-vqmod'], gulpIgnore.exclude("**/vqmod/xml/**")))
            .pipe(conn.dest(serverConfig.remoteDir))
            .pipe(ftpNotifier);

        done();
    };


    /**
     *  Client deploy
     */
    gulp.task('deploy-compiled-ftp', gulp.series('package', function (done) {

        /*
         *
         */
        let serverConfigFile = args.server;

        /*
         * load server connexion config
         */
        let serverConfigLoader = require('../my-helpers/load-server-config-from-filezilla-format');
        let serverConfig       = serverConfigLoader.getFtpConfigUsingPixlXml(serverConfigFile);

        return deployModuleFtp(serverConfig, done);

    }));

    return {
        deployModuleFtp
    }

}