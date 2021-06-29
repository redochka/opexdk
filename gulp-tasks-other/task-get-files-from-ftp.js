let args = require('yargs').argv;
if (args.vv) console.log(("Loading " + __filename).grey);

/**
 *
 */
module.exports = function (extension) {

    const gulp     = require('gulp');
    const log      = require('fancy-log');
    let fs         = require("fs-extra");
    const path     = require('path');
    let async      = require('async');    //async.series rocks! TODO test. https://github.com/caolan/async#eachLimit
    let Promise    = require("bluebird");

    //https://github.com/icetee/node-ftp
    //npm install git+https://git@github.com/icetee/node-ftp -s
    //git+ssh://git@github.com/visionmedia/express.git
    // var Client = require('ftp');
    var Client = require('@icetee/ftp');  //trying to get around the listing issue. See https://github.com/icetee/remote-ftp/issues/991

    let c;
    let serverConfig;


    /**
     *
     */
    let getFtpConfigAndInitFtpClient = function (ftpConfigFile) {

        /*
         * load server connexion config
         */
        let serverConfigLoader = require('../my-helpers/load-server-config-from-filezilla-format');
        serverConfig           = serverConfigLoader.getFtpConfigUsingPixlXml(ftpConfigFile);
        log.info("serverConfig: ", serverConfig);


        /*
         *
         */
        c = new Client();

        /*
         *
         */
        c.on('greeting', function (x) {
            log.info("FTP greeting: ", x);
        });


        /*
         *
         */
        c.on('ready', function () {
            log.info("FTP Connection ready");

            c.list(".", false, function (err, list) {
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


    let getFile = function (remotePath, localPath, cb = null) {

        log.info("★ Downloading %s to %s", remotePath, localPath);

        c.get(remotePath, function (err, stream) {
            if (err) throw err;
            stream.pipe(fs.createWriteStream(localPath));
            cb ? cb() : undefined;
        });
    };

    let buildListOfRemoteFiles = function () {

        return new Promise(function (res, rej) {

            let destination = args.d;
            let src         = args.src;    //'vqmod/xml/'

            fs.ensureDirSync(path.join('/tmp/', destination));

            c.list(path.join(serverConfig.remoteDir, src), function (err, list) {
                if (err) throw err;

                let remoteFiles = [];
                list.forEach(function (o) {
                    if (o.type === '-' /*file*/) {
                        let remoteFile = path.join(src, o.name);
                        remoteFiles.push(remoteFile);
                    }
                });

                res(remoteFiles);
            });
        });

    };

    const FTP_MAX_CONN = 10;    //default
    let taskPull       = function () {

        buildListOfRemoteFiles().then(function (x) {
            async.eachLimit(x, ftpConf.parallel || FTP_MAX_CONN, function (a, next) {
                getFile(path.join(serverConfig.remoteDir, a), path.join('./tmp/', args.d, "/", a), next);
            });
        });
    };

    /**
     * gulp pull --src vqmod/vqcache/ -d ivan --ftp ivan
     */
    gulp.task('get-log-ftp', function () {
        taskPull();
    });

    /**
     *
     */
    gulp.task('get-log-ftp', function () {

        getFtpConfigAndInitFtpClient(args.server);

        let localPath = './tmp/error.log';
        fs.ensureDirSync(localPath);

        getFile(path.join(serverConfig.remoteDir, 'system/logs/error.log'), localPath)
    });


};

if (args.vv) console.log(("Loaded: " + __filename).grey)
