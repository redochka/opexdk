const gulp       = require('gulp');
const path       = require('path');
const fs         = require("fs-extra");
const log        = require('fancy-log');
const axios      = require("axios");
const args       = require('yargs').argv;
const vqmodUtils = require("../lib/utils/vqmod-utils");

let watchDir = function (dir, remoteDir, uploadFile, defaultOru) {

    log.info("watching dir: ", dir);

    if (args.vq2oc2sys) {
        //At startup gulpVqmodToOcmod. Otherwise, if system-gen not yet created, first modification of vqmod will not be watched/uploaded
        let sourcePath = path.join(dir, '/public/module/vqmod/xml/**/*');
        let targetPath = path.join(dir, '/public/module/system-gen/');
        //but first delete old directory to avoid stale/old files
        fs.removeSync(targetPath);
        vqmodUtils.gulpVqmodToOcmod(gulp, sourcePath, targetPath);

        gulp.watch(sourcePath, function (cb) {
            vqmodUtils.gulpVqmodToOcmod(gulp, sourcePath, targetPath);
            cb();  //this cb is important. Gulp pff..
        });
    }

    let watcher = gulp.watch(dir + '/public/module/**/*');

    watcher.on('change', function (changedFile) {

        if (changedFile.indexOf(".vqmod.xml") > 0 && args.vq2oc2sys) {
            return;
        }

        log.info("★ Deploy the changed file only: ", changedFile);  //event has type: "changed" and path: "/home/.../test-extension/public/module/vqmod/xml/test.vqmod.xml"

        let remotePaths    = [];
        let doOcmodRefresh = false;

        if (changedFile.indexOf('coca') > 0 && changedFile.indexOf('/common/' > 0)) {
            remotePaths.push(changedFile.replace("/common/", "/admin/"));
            remotePaths.push(changedFile.replace("/common/", "/catalog/"));
        } else if (changedFile.indexOf('system-gen') > 0) {
            remotePaths.push(changedFile.replace("/system-gen/", "/system/"));
            doOcmodRefresh = true;
        } else {
            remotePaths.push(changedFile);
        }

        remotePaths.forEach(value => {
            let changedFileRelativePath = path.relative(dir + "/public/module/", value);
            let remotePath              = path.join(remoteDir, changedFileRelativePath);

            log.info("★ remote path is: ", remotePath);
            if (doOcmodRefresh) {
                uploadFile(changedFile, remotePath, function () {
                    log.info("ocmod file was uploaded to system. Going to call or not the refresh url passed through oru");
                    if (args["oru"]) {

                        let ocmodRefreshUrl = args["oru"];
                        if (args["oru"] === true && defaultOru) {
                            ocmodRefreshUrl = defaultOru;
                        } else {
                            //string url was passed
                            //do nothing, just use it
                        }

                        log.info("Going to call this url: ", ocmodRefreshUrl);


                        axios.get(ocmodRefreshUrl).then(function (response) {
                            // handle success
                            console.log(response.data);
                        })
                            .catch(function (error) {
                                // handle error
                                console.log(error);
                            })
                            .then(function () {
                                // always executed
                            });

                    } else {
                        log.info('oru flag not provided. Aborting!');
                    }
                });
            } else {
                uploadFile(changedFile, remotePath);
            }
        });

    });
}

module.exports = watchDir;
