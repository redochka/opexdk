import {Client} from "node-scp";
import log from "fancy-log";
import 'colorts/lib/string';
import {ServerConfig} from "./types/opexdk.types";

/**
 *
 */
export const uploadFile = function (sourcePath: string, remotePath: string, serverConfig: ServerConfig, done: () => void) {

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
      .then(_response => {
        client.close() // remember to close connection after you finish

        log("✔ SFTP completed. No error.".green);
        require("./opexdk-notifier").notify('Compiled extension was uploaded successfully.');
        if (done) done();

      })
      .catch(error => {
        console.log(error);
      })
  }).catch(e => console.log(e))
}