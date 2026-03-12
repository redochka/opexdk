const fs = require("fs");
const path = require("path");
module.exports = function (extension) {

  const gulp = require('gulp');
  const cu = require("../gulp-includes/common-utils.js");


  gulp.task('copy-doc-folder', function (done) {

    const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension);
    const MY_DIST_DIR = cu.getPathToExtensionDistFolder(FINAL_FILENAME, extension);
    const MY_BUILD_DIR = cu.getPathToExtensionBuildFolder(FINAL_FILENAME, extension);
    const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

    console.log("★ Going to copy doc folder");

    const DOC_SRC = path.join(MY_BUILD_DIR, "/public/doc");

    // Check if the source directory exists
    if (!fs.existsSync(DOC_SRC)) {
      console.log("★ Doc folder not found, skipping copy.");
      done();
      return;
    }

    return gulp.src([path.join(DOC_SRC, "/**")])
      .pipe(gulp.dest(path.join(MY_DIST_DIR, "/doc")));
  });

}
