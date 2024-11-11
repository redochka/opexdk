import log from "fancy-log";
import {deployCompiledSftpArgs} from "./args-utils";
import {ServerConfig} from "./types/opexdk.types";
import 'colorts/lib/string';

export const SftpSpeaker = function () {
  let sftp;
  let serverConfig: ServerConfig;


  let connectToSftp = function (callback) {

    const args = deployCompiledSftpArgs();

    if (!args.server) {
      console.error("Missing `server` argument. Aborting!");
      process.exit();
    }

    let serverConfigFile = args.server;

    /*
     * load server connexion config
     */
    let serverConfigLoader = require('../../my-helpers/load-server-config-from-filezilla-format');
    serverConfig = serverConfigLoader.getFtpConfigUsingPixlXml(serverConfigFile);
    console.log("serverConfig:\n", serverConfig);

    /*
     *
     */
    let Client = require('ssh2-sftp-client');  //https://www.npmjs.com/package/ssh2-sftp-client
    sftp = new Client();
    sftp.connect({
      host             : serverConfig.host,
      port             : serverConfig.port,
      username         : serverConfig.user,
      password         : serverConfig.pass,
      keepaliveInterval: 10000,
    }).then(() => {
      log("SFTP connected".green);
      if (callback) callback();
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
  let uploadFile = function (sourcePath, remotePath, cb = null) {

    log("Uploading %s to %s", (sourcePath.split('public/module')[1]).magenta, (remotePath).magenta);

    if (cb) {
      sftp.put(sourcePath, remotePath).then(() => {
        cb();
      })
    } else {
      sftp.put(sourcePath, remotePath).then(() => {
        console.log("file was uploaded");
      }).catch(err => {
        console.error("Error uploading the file", err.message);
      });

    }
  };

  let deleteFile = function (remotePath) {
    let notFoundOK = true;
    sftp.delete(remotePath, notFoundOK);
  };

  let closeConnection = function () {
    sftp.end();
  };


  return {
    connectToSftp,
    uploadFile,
    closeConnection,
    deleteFile,
  };

};
