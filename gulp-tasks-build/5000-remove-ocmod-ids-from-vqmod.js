const path = require("path");
module.exports = function (extension) {

  const gulp = require('gulp');
  const cheerio = require('gulp-cheerio');
  const cu = require("../gulp-includes/common-utils.js");
  const fs = require('fs-extra');

  /**
   *
   */
  //gulp.task('remove-ocmod-ids-from-vqmod', gulp.series('translate-markdown-to-html-from-dist', function () {
  gulp.task('remove-ocmod-ids-from-vqmod', function (done) {

    const FINAL_FILENAME = cu.getPublicNameOfDelivery(extension);
    const LEGACY_DIST_DIR = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

    /*
     *
     */
    fs.removeSync(path.join(LEGACY_DIST_DIR, '/ocmod-only'));

    /*
     *
     */
    let VQMOD_XML_PATH = path.join(LEGACY_DIST_DIR, "/upload/vqmod/xml");

    // Check if the source directory exists
    if (!fs.existsSync(VQMOD_XML_PATH)) {
      console.log("★ vqmod/xml folder not found, skipping ocmod processing.");
      done();
      return;
    }

    return gulp.src([path.join(VQMOD_XML_PATH, "/*")])
      .pipe(cheerio({  //remove ocmod tags from vqmod files.
        run          : function ($, file) {
          $('code').remove();
          $('name').remove();
          $('link').remove();
        },
        parserOptions: {
          xmlMode: true
        }
      }))
      .pipe(gulp.dest(VQMOD_XML_PATH));

  });
}
