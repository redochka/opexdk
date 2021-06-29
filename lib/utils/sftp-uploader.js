const log = require('fancy-log');

/**
 *
 */
const uploadFile = function (sourcePath, remotePath, serverConfig, done) {

    log("Uploading %s to %s", sourcePath, remotePath);

    let client = require('scp2');  //best scp (sftp) client

    client.scp(sourcePath, {
        host    : serverConfig.host,
        port    : serverConfig.port,
        username: serverConfig.user,
        password: serverConfig.pass,
        path    : remotePath
    }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("✔ SFTP completed. No error.");
            require("./opexdk-notifier").notify('Compiled extension was uploaded successfully.');
            if (done) done();
        }
    });
};

exports.uploadFile = uploadFile;
