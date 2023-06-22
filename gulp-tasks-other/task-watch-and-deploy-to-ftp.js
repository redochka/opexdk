var args     = require('yargs').argv;
if(args.vv) console.log(("Loading " + __filename).grey);

/**
 * gulp watchftp -m testftp --ftp dev.offerz.ftp.xml
 */
module.exports = function(extension){

    const gulp     = require('gulp');
    const prompt   = require('prompt');
    const log      = require('fancy-log');
    const cu       = require("../gulp-includes/common-utils.js");
    const cache    = require('gulp-cached');
    const watchDir = require('./task-watch-and-deploy-to-xxx-common');


    //https://github.com/icetee/node-ftp
    //npm install git+https://git@github.com/icetee/node-ftp -s
    //git+ssh://git@github.com/visionmedia/express.git
    // var Client = require('ftp');
    const Client = require('@icetee/ftp');  //trying to get around the listing issue. See https://github.com/icetee/remote-ftp/issues/991

    let c;
    let serverConfig;


    let defaultOru = "";
    if(extension.devSpec && extension.devSpec.watchTask && extension.devSpec.watchTask.ocmodRefreshUrl){
        defaultOru = extension.devSpec.watchTask.ocmodRefreshUrl;
    }

    /**
     *
     */
    let getFtpConfigAndInitFtpClient = function (ftpConfigFile) {

       /*
        * load server connexion config
        */
        let serverConfigLoader = require('../my-helpers/load-server-config-from-filezilla-format');
        serverConfig = serverConfigLoader.getFtpConfigUsingPixlXml(ftpConfigFile);
        log.info("serverConfig: ", serverConfig);


        /*
         *
         */
        c = new Client();

        /*
         *
         */
        c.on('greeting', function(x) {
            log.info("FTP greeting: ", x);
        });


        /*
         *
         */
        c.on('ready', function() {
            log.info("FTP Connection ready");

            c.list(".", false, function(err, list) {
                if (err) throw err;
                console.dir("directories listing: ", list);
                // c.end();
            });
        });


        // connect to localhost:21 as anonymous
        c.connect({
            host    : serverConfig.host,
            user    : serverConfig.user,
            password: serverConfig.pass,
        });


    };


    let uploadFile = function (sourcePath, remotePath, cb) {

        log.info("★ Uploading %s to %s", sourcePath, remotePath);

        c.put(sourcePath, remotePath, function(err) {
            if (err) throw err;
            if (cb) {
                cb();
            }
            //c.end();
        });
    };

    /**
     *
     */
    let watchExtensionAndItsDependency = function(){
        log.info("Watching extension and its dependency");

        let dirs = cu.getExtensionAndDepsDirs(extension);

        dirs.forEach(function(dir){
            watchDir(dir, serverConfig.remoteDir, uploadFile, defaultOru);
        });
    };


    /**
     *
     */
    let deployExtensionAndItsDependencyToFtp = function () {
        log.info("Deploying Extension And Its Dependency to FTP (NOT DEVELOPED)");

        var dirs = cu.getExtensionAndDepsDirs(extension);

        dirs.forEach(function(dir){
            uploadFile(dir);
        });
    };



    /**
     *
     */
    gulp.task('watch-ftp', function () {

        /*
         * Get our destination
         */
        getFtpConfigAndInitFtpClient(args.server);

        if(args.yes) {
            watchExtensionAndItsDependency();
            return;
        }

        /*
         *
         */
        prompt.message = "\n";
        prompt.delimiter = "\n";

        prompt.start();

        prompt.get({
            properties : {
                ocfolder : {
                    description : ("Do you confirm oc folder: ").red + (serverConfig.host).magenta + ":" + (serverConfig.remoteDir).magenta
                }
            }
        }, function(err, result) {

            if (result.ocfolder === 'y') {

                if(args.deploy){
                    deployExtensionAndItsDependencyToFtp();
                }
                watchExtensionAndItsDependency();
            }

        });


    });


};

if(args.vv) console.log(("Loaded: " + __filename).grey)
