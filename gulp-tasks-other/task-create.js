const {argv: args} = require("yargs");
module.exports = function (extension) {

    const gulp         = require('gulp');
    const rename       = require("gulp-rename");
    const replace      = require('gulp-replace');
    const randomstring = require('randomstring');
    const walkdir      = require('walkdir');
    const path         = require('path');
    const fs           = require('fs');
    const args         = require('yargs').argv;
    const debug        = require('debug')('create');
    const cu           = require("../gulp-includes/common-utils.js");


    const getRandomHash = function () {
        return randomstring.generate(5).toLowerCase();
    }

    const getPathToSrc = function () {

        const homeEnv = process.env.OPEXDK_SRC_PATH;
        debug("★ homeEnv: ", homeEnv);
        const homes = homeEnv.split(",");
        const home  = homes.pop();
        debug(home);

        const PATH_TO_SRC_OC2 = home; //+ '/src/oc2/';
        const PATH_TO_SRC_OC3 = home; //+ '/src/oc3/';

        let pathToSrc = PATH_TO_SRC_OC2;
        if (args.skel === "skel_oc30") {
            pathToSrc = PATH_TO_SRC_OC3;
        }
        return pathToSrc;
    };

    /**
     ProWebTec 》 is added automatically to display name
     opexdk create --skel skel_oc23     --displayName "Admin long login" --finalName lolo-oc23      --shortName lolo-oc23      --capitalCamel Lolo         --underscore lolo
     opexdk create --skel skel_crud_oc3 --displayName "TicketStatus"     --finalName ticket-status  --shortName ticket_status  --capitalCamel TicketStatus --underscore ticket_status
     opexdk create --skel skel_oc30     --displayName "CACS admin"       --finalName cacs-admin-oc3 --shortName cacs-admin-oc3 --capitalCamel Cacs         --underscore cacs
     */
    gulp.task('create_from_skeleton', function () {

        const AVAILABLE_SKELETONS = ["skel_oc22", "skel_oc23", "skel_oc30", "skel_crud_oc2", "skel_crud_oc3"];

        /*
         * Early check
         */
        if (!args.skel) {
            console.error("Skel argument is required, Aborting!");
            return;
        }

        if (AVAILABLE_SKELETONS.indexOf(args.skel) <= -1) {
            console.error("Skeleton must be one of: ", AVAILABLE_SKELETONS, ". Aborting!");
            return;
        }

        const pathToSkel = path.join(cu.getExtSkeletonsAbsPath(), args.skel, "/**/*");
        const pathToSrc  = getPathToSrc();
        const pathToDest = path.join(pathToSrc, args.finalName);

        debug("Going to use this skeleton: ", pathToSkel);
        debug("Extension will be yield into: ", pathToDest);

        /*
         * We are doing the same as battlecry and it's casex all in one function for transforming word casings
         * https://battlecry.js.org/casex-naming
         */
        return gulp.src(pathToSkel)
            .pipe(replace("__DISPLAY_NAME__", args.displayName, {skipBinary: true}))
            .pipe(replace("__SK__FINAL_NAME__", args.finalName, {skipBinary: true}))
            .pipe(replace("__SHORT_NAME__", args.shortName, {skipBinary: true}))
            .pipe(replace("__MODULE_CAPITAL_CAMEL__", args.capitalCamel, {skipBinary: true}))
            .pipe(replace("__MODULE_UNDERSCORE__", args.underscore, {skipBinary: true}))
            .pipe(replace("__RANDOM_HASH__", getRandomHash(), {skipBinary: true}))
            .pipe(replace("__MODULE__", args.moduleName, {skipBinary: true}))
            .pipe(rename(function (path) {
                // To replace only in files. Because only files have an extension. Thus, excluding directories.
                //if (path.extname) {
                //}
                //rename files and directories like assets/extension_skeletons/skel_oc30/public/module/system/library/__MODULE_UNDERSCORE__/__MODULE_UNDERSCORE___event_trait.php
                path.basename = path.basename.replace("__MODULE_UNDERSCORE__", args.underscore);
            }))
            .pipe(gulp.dest(pathToDest))
            ;
    });

    /**
     * We had to use a walkdir solution, because gulp-rename can not rename directories. It renames only files.
     */
    gulp.task('rename_dir', function (done) {

        const callback = function (myPath, stat) {

            /*
             * Ignore directories I am not interested in.
             */
            if (path.basename(myPath) !== "__MODULE__") {
                debug("★ Ignoring: " + path.basename(myPath));
                return;
            }

            /*
             * Rename
             */
            fs.rename(myPath, myPath.replace("__MODULE__", args.moduleName), function (err) {
                if (err) {
                    throw err;
                }
            });
        };

        const pathToSrc         = getPathToSrc();
        const walkStartingPoint = path.join(pathToSrc, args.finalName);
        debug("★ rename_dir has run");
        debug("★ Walk Starting point: ", walkStartingPoint);

        walkdir.sync(walkStartingPoint, callback);
        require('../lib/utils/opexdk-notifier').notify("Extension should have been created!");

        done();
    });


    gulp.task('create', gulp.series('create_from_skeleton', 'rename_dir'), function (done) {
        done();
    });

};
