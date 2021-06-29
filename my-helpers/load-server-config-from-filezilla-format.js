const fs   = require('fs');
const path = require('path');
// var parser = require('xml2json'); //bad using very old lib of node-expat which requires to compile a c module on the server...
//next time use: xml2js


//if(!process.env.OPEXDK_HOME){
//    console.error("No OPEXDK_HOME env defined. Please export a OPEXDK_HOME in your bashrc file. Aborting!");
//    process.exit();
//}


let getFtpConfigUsingPixlXml = function (ftpConfigFile) {
    const XML = require('pixl-xml');
    let xml   = fs.readFileSync(path.join(process.env.OPEXDK_SERVERS_INVENTORY, ftpConfigFile));
    let doc   = XML.parse(xml);
    // console.log(doc);


    let host = doc.Servers.Server.Host;
    let port = doc.Servers.Server.Port;
    let user = doc.Servers.Server.User;
    let pass = doc.Servers.Server.Pass;
    // let buff = new Buffer(pass, 'base64');
    // pass = buff.toString('ascii');
    let remoteDir = doc.Servers.Server.RemoteDir;

    return {
        host, user, pass, port, remoteDir
    };
};

/**
 * not used
 */
let getFtpConfigUsingXml2Js = function (ftpConfigFile) {

    let xml = fs.readFileSync(path.join(process.env.OPEXDK_SERVERS_INVENTORY, ftpConfigFile));

    const util        = require('util');
    const parseString = require('xml2js').parseString;
    let x             = parseString(xml, function (err, result) {
        // console.dir(result);
        // console.log(util.inspect(result, false, null));

        let servers = result['FileZilla3'].Servers;
        let server  = servers.shift().Server.shift();


        let host      = server['Host'].shift();
        let port      = server['Port'];
        let user      = server['User'];
        let pass      = server['Pass'];
        let remoteDir = server['RemoteDir'];


        let myresult = {
            host, user, pass, port, remoteDir
        };

        return myresult;
    });

    return x;
};


module.exports = {
    getFtpConfigUsingXml2Js : getFtpConfigUsingXml2Js,
    getFtpConfigUsingPixlXml: getFtpConfigUsingPixlXml
};
