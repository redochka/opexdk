module.exports = function () {

    const args = require('yargs').argv;
    const log  = require('fancy-log');


    let sftp;
    let serverConfig;


    let connectToSftp = function (callback) {

        if (!args.server) {
            console.error("Missing `server` argument. Aborting!");
            process.exit();
        }

        let serverConfigFile = args.server;

        /*
         * load server connexion config
         */
        let serverConfigLoader = require('../../my-helpers/load-server-config-from-filezilla-format');
        serverConfig           = serverConfigLoader.getFtpConfigUsingPixlXml(serverConfigFile);
        console.log("serverConfig:\n", serverConfig);

        /*
         *
         */
        let Client = require('ssh2-sftp-client');  //https://www.npmjs.com/package/ssh2-sftp-client
        sftp       = new Client();
        sftp.connect({
            host    : serverConfig.host,
            port    : serverConfig.port,
            username: serverConfig.user,
            password: serverConfig.pass

        }).then(() => {
            // return sftp.list('/home/reda/tmp/testnodesftp');

        }).then((data) => {
            // console.log(data, 'the data info');

        }).catch((err) => {
            console.log(err, 'catch error');
        });


        return serverConfig;
    };


    /**
     * This sftp node module requires to specify the destination file (not just only the directory)
     */
    let uploadFile = function (sourcePath, remotePath, cb=null) {

        log("Uploading %s to %s", (sourcePath.split('public/module')[1]).magenta, (remotePath).magenta);

        if(cb){
            sftp.put(sourcePath, remotePath).then(() => {
                cb();
            })
        }else{
            sftp.put(sourcePath, remotePath);
        }
    };


    return {
        connectToSftp,
        uploadFile
    };

};
