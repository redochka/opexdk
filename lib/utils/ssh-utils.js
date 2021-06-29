const fs        = require('fs')
const path      = require('path')
const {NodeSSH} = require('node-ssh')

const ssh = new NodeSSH()

function deleteFile(serverConfig, remotePath) {

    ssh.connect({
        host    : serverConfig.host,
        port    : serverConfig.port,
        username: serverConfig.user,
        password: serverConfig.pass,
    })
        /*
         Or
         ssh.connect({
           host: 'localhost',
           username: 'steel',
           privateKey: fs.readFileSync('/home/steel/.ssh/id_rsa', 'utf8')
         })
         if you want to use the raw string as private key
         */
        .then(function () {
            // Local, Remote
            ssh.execCommand(`ls ${remotePath}`).then(function(result) {
                console.log('STDOUT: ' + result.stdout)
                console.log('STDERR: ' + result.stderr)
            });
        })
}

module.exports.deleteFile = deleteFile;