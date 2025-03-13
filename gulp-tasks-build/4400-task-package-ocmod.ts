import gulp from "gulp";
import zip from "gulp-zip";
import fs from "fs";
import path from "path";
import rename from "gulp-rename";
import {ExtensionManifestPackaging} from "../lib/utils/types/opexdk.types";
import {packageArgs} from "../lib/utils/args-utils";
import {cu} from "../gulp-includes/common-utils-ts";
import debug0 from "debug";

const debug = debug0('package');
debug("task-package-ocmod: loading...");

module.exports = function (extension: ExtensionManifestPackaging) {

  gulp.task('package-ocmod', gulp.series('preserve-upload-folder', function (done) {

    const args = packageArgs();

    /*
     *
     */
    if (!args.ocmod) {
      console.log("★ `ocmod` flag was not specified. Abort!");
      done();
      return;
    }


    const FINAL_FILENAME = cu.buildPublicNameOfDelivery(extension, args.admin);
    const MY_BUILD_DIR = cu.buildPathToExtensionBuildFolder(FINAL_FILENAME, extension.private_dist_dir);
    const OCMOD_DIST_DIR = cu.getPathToExtensionOcmodDistFolder(FINAL_FILENAME, extension);


    let path1 = path.join(MY_BUILD_DIR, "/ocmod-merge/wrapper-of-upload");
    if (!fs.existsSync(path1)) {

      console.log("★ This extension has no PHP or template files");

      /*
       * Generate simple extension_name.ocmod.xml
       */
      return gulp.src(path.join(MY_BUILD_DIR, "/ocmod-merge/install.xml"), {allowEmpty: true})
        .pipe(rename(function (path) {
          // path.dirname += "/ciao";
          path.basename = FINAL_FILENAME;
          path.extname = ".ocmod.xml";
        }))
        .pipe(gulp.dest(OCMOD_DIST_DIR))

    } else {

      console.log("★ Generate full OCMOD package.");

      // let excludedVqmod = path.normalize(`!${MY_BUILD_DIR}/ocmod-merge/wrapper-of-upload/upload/vqmod`);
      return gulp.src([
        path.join(MY_BUILD_DIR, "/ocmod-merge/install.xml"),
        path.join(MY_BUILD_DIR, "/public/ocmod-only/install.php"),
        path.join(MY_BUILD_DIR, "/ocmod-merge/wrapper-of-upload/**/*"),
      ], {
        allowEmpty: true,
      }).pipe(zip(FINAL_FILENAME + '.ocmod.zip'))
        .pipe(gulp.dest(OCMOD_DIST_DIR));
    }
  }));
};