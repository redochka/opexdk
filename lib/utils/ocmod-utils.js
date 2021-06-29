const debug = require('debug')('vqmod-utils');

const cheerio = require('gulp-cheerio');
const gulpif  = require('gulp-if');
const rename  = require("gulp-rename");
const replace = require('gulp-replace');
const args    = require('yargs').argv;


/**
 *
 */
function gulpOcmodToVqmod(gulp, sourcePath, targetPath) {

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

    debug("targetPath is", targetPath)
    return gulp.src([sourcePath])
        .pipe(loadXmlAndTranslateFileNodes)
        .pipe(rename(function (path) {
            //console.log(path);
            if(path.basename.indexOf("ocmod") > 0){  //toto.ocmod.xml
                if(path.extname === ".xml") path.basename = path.basename.replace('ocmod', 'vqmod');
            }else{  //install.xml
                if(path.extname === ".xml") path.basename = path.basename + ".vqmod";  //install.xml → install.vqmod.xml
            }

        }))
        .pipe(gulpif(shouldRevertAdminFolderName, replace(`${args.admin}/`, "admin/", {skipBinary: true})))
        .pipe(gulp.dest(targetPath));
}

const loadXmlAndTranslateFileNodes = cheerio({
    run          : function ($, file) {
        // Each file will be run through cheerio and each corresponding `$` will be passed here.
        // `file` is the gulp file object
        $('file').each(function () {
            let $file = $(this);
            $file.attr('name', $file.attr('path'));
            $file.attr('path', null);

            $('operation', $file).each(function(){
                var $op = $(this);

                var $search = $('search', $op);
                var $add = $('add', $op);

                $search.attr('position', $add.attr('position'));
                $add.attr('position', null);

                if($add.attr('offset')){
                    $search.attr('offset', $add.attr('offset'));
                    $add.attr('offset', null);
                }

                /*
                 * index_in_vqmod = index_in_ocmod + 1
                 * vqmod is 1 based
                 * ocmod is 0 based
                 */
                if($search.attr('index')){
                    $search.attr('index', parseInt($search.attr('index')) + 1);
                }
            });
        });
    },
    parserOptions: {
        xmlMode: true
    }
});

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
    gulpOcmodToVqmod: gulpOcmodToVqmod
}