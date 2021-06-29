const args = require('yargs').argv;
if(args.vv) console.log(("Loading " + __filename).grey);


/**
 *
 */
module.exports = function(extension){

    const gulp  = require('gulp');
    const cu    = require("../gulp-includes/common-utils.js");
    const shell = require('shelljs');

    gulp.task('rename-package-for-cloud', gulp.series('package-ocmod', function (done) {

        /*
         *
         */
        if(!args.ocmod) {
            console.log("★ `ocmod` flag was not specified. Abort!");
            done();
            return;
        }

        if(!args.cloud) {
            console.log("★ `cloud` flag was not specified. Abort!");
            done();
            return;
        }


        const FINAL_FILENAME  = cu.getPublicNameOfDelivery(extension);
        const MY_BUILD_DIR    = cu.getPathToExtensionBuildFolder(FINAL_FILENAME, extension);
        const MY_DIST_DIR     = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);
        const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);
        const OCMOD_DIST_DIR  = cu.getPathToExtensionOcmodDistFolder(FINAL_FILENAME, extension);
        const CLOUD_DIST_DIR  = cu.getZipsDirAbsPath();


        const src = `${OCMOD_DIST_DIR}/${FINAL_FILENAME}.ocmod.zip`;
        const dst = CLOUD_DIST_DIR + "/" + cu.getNameOfCloudZip(FINAL_FILENAME);
        shell.cp(src, dst);

        done();
    }));

}

if(args.vv) console.log(("Loaded: " + __filename).grey)
