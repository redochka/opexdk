const debug   = require('debug')('vqmod-utils');
const cheerio = require('gulp-cheerio');
const gulpif  = require('gulp-if');
const rename  = require("gulp-rename");
const replace = require('gulp-replace');
const args    = require('yargs').argv;


/**
 *
 */
function gulpVqmodToOcmod(gulp, sourcePath, targetPath) {

    /**
     * utility
     */
    let shouldRevertAdminFolderName = function (file) {
        if (args.revertAdminForOcmod) {
            debug("★ We should revert admin folder name change");
            return true;
        }
        return false;
    }

    debug("sourcePath is", sourcePath)
    debug("targetPath is", targetPath)
    return gulp.src([sourcePath])
        .pipe(cheerio({
            run          : loadXmlAndTranslateFileNodes,
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(rename(function (path) {
            debug("★ Renaming or not: ", path);
            if (path.extname === ".xml") path.basename = path.basename.replace('.vqmod', '.ocmod');
        }))
        .pipe(gulpif(shouldRevertAdminFolderName, replace(`${args.admin}/`, "admin/", {skipBinary: true})))
        .pipe(gulp.dest(targetPath));
}

const loadXmlAndTranslateFileNodes = function ($, file) {
    // Each file will be run through cheerio and each corresponding `$` will be passed here.
    // `file` is the gulp file object
    $('file').each(function () {
        let $file = $(this);

        let nameAttr = $file.attr('name');
        if (nameAttr.indexOf(",") >= 0) {
            debug("name attr contains `,` going to duplicate the file node for each file name");
            let fileNames = nameAttr.split(",");
            for (const fileName of fileNames) {
                debug("★ filename: ", fileName);
                let $fileClone = $file.clone();
                $fileClone.attr('name', fileName);
                $file.before($fileClone + "\n");
                translateFileNode($, $fileClone);
            }
            $file.remove();
        } else {
            translateFileNode($, $file);
        }

    });

    $('vqmver').remove();

}

const translateFileNode = function ($, $file) {

    $file.attr('path', $file.attr('name'));
    $file.attr('name', null);

    $('operation', $file).each(function () {
        let $op = $(this);

        let $search = $('search', $op);
        let qAdd    = $('add', $op);

        qAdd.attr('position', $search.attr('position'));
        $search.attr('position', null);

        if ($search.attr('offset')) {
            qAdd.attr('offset', $search.attr('offset'));
            $search.attr('offset', null);
        }

        /*
         * index_in_vqmod = index_in_ocmod + 1
         * vqmod is 1 based
         * ocmod is 0 based
         */
        if ($search.attr('index')) {
            $search.attr('index', parseInt($search.attr('index')) - 1);
        }
    });
}

module.exports = {
    gulpVqmodToOcmod: gulpVqmodToOcmod
}