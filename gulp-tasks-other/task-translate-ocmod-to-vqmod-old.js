var args    = require('yargs').argv;
if(args.vv) console.log("task-ocmod-to-vqmod: loading...");

/*
 * This task is not meant for the usual process
 * it's to be run independently.
 */

module.exports = function(){
    
    
    /*
     * See OCMOD documentation:
     * http://forum.opencart.com/viewtopic.php?f=24&t=131995
     * 
     * [VQMOD]
     * id, version, author, vqmver
     *     
     * [OCMOD]
     * id, version, author, code, name, link
     */
    
    const gulp    = require('gulp');
    const gulpif  = require('gulp-if');
    const args    = require('yargs').argv;
    const cheerio = require('gulp-cheerio');
    const rename  = require("gulp-rename");
    const replace = require('gulp-replace');

    /*
     *
     */
    gulp.task('translate-to-vqmod', function () {

        /**
         * utility
         */
        const hasCustomAdminFolder = function (file) {
            if (args.admin) {
                console.log("★ We should rename admin folder");
                return true;
            }
            return false;
        };

        /*
         * Translate OCMOD into VQMOD 
         */

        const pathToOcmod = "/home/reda/Work/WorkspaceOpencart/depot-others/extensions/cazasouq/mastercard/OpenCart 2.0.0.0 - 2.2.0.0/";

        return gulp.src(pathToOcmod + "install.xml").pipe(cheerio({

            run: function ($, file) {

                console.log("running");

                // Each file will be run through cheerio and each
                // corresponding `$` will be passed here.
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

            }})).pipe(rename(function (path) {
                //console.log(path);
                if(path.basename.indexOf("ocmod") > 0){  //toto.ocmod.xml
                    if(path.extname === ".xml") path.basename = path.basename.replace('ocmod', 'vqmod');
                }else{  //install.xml
                    if(path.extname === ".xml") path.basename = path.basename + ".vqmod";  //install.xml → install.vqmod.xml
                }

            })).pipe(gulpif(hasCustomAdminFolder, replace("admin/", args.admin + "/", {skipBinary: true})))

               .pipe(gulp.dest(pathToOcmod));
        
    });
    
}



if(args.vv) console.log("task-ocmod-to-vqmod: loaded");