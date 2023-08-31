const log = require('fancy-log');
const {Client} = require('node-scp')

/**
 *
 */
const uploadFile = function (sourcePath, remotePath, serverConfig, done) {

  Client({
    host    : serverConfig.host,
    port    : serverConfig.port,
    username: serverConfig.user,
    password: serverConfig.pass,
    // privateKey: fs.readFileSync('./key.pem'),
    // passphrase: 'your key passphrase',
  }).then(client => {
    client.uploadDir(
      sourcePath,
      remotePath,
      // options?: TransferOptions
    )
      .then(response => {
        client.close() // remember to close connection after you finish

        log("✔ SFTP completed. No error.");
        require("./opexdk-notifier").notify('Compiled extension was uploaded successfully.');
        if (done) done();

      })
      .catch(error => {
        console.log(error);
      })
  }).catch(e => console.log(e))
}

exports.uploadFile = uploadFile;
