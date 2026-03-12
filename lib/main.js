const {hideBin} = require("yargs/helpers");
const yargs = require("yargs");
const debug = require("debug")("main");

function getMissingEnvVars(requiredEnvVars) {

    let missingEnvVars = [];

    for (const requiredEnvVar of requiredEnvVars) {
        if (!process.env[requiredEnvVar]) {
            missingEnvVars.push(requiredEnvVar);
        }
    }

    return missingEnvVars;
}

function displayMissingEnvVars(requiredEnvVars) {
    const missingEnvVars = getMissingEnvVars(requiredEnvVars);
    if (missingEnvVars.length > 0) {
        console.error(`✘ Missing env variables ${missingEnvVars}. Aborting!`);
        return true;
    }
    return false;
}

/**
 *
 */
function main() {

    if (displayMissingEnvVars([
        "OPEXDK_SRC_PATH",
        "OPEXDK_VHOST_PATH",
    ])) return;

    const args = yargs(hideBin(process.argv)).parse()
    // {
    //   _: [ 'watch-sftp' ],
    //   m: 'app4oc',
    //   server: 'cazasouq-wwwtest411.sftp.xml',
    //   yes: true,
    //   '$0': 'bin/index-global.js'
    // }


    debug('main arg: ', args._);
    const task = args._.length > 0 ? args._[0] : args.t

    debug("task is: ", task);

    if (!task) {
        console.error("✘ no task specified. Aborting!");
        return;
    }

    invokeGulpTask(task);
}

function invokeGulpTask(task) {

    const gulp = require('gulp');
    const gulpfile = require('../gulpfile');
    gulpfile.loadTasks();

    console.log("Going to invoke task: ", task);
    gulp.task(task)();
}

function loadManifest(m) {

    if (displayMissingEnvVars([
            "OPEXDK_SRC_PATH",
        ]
    )) return;

    const args = {
        m: m,
    }

    const extensionManifest = require('../my-helpers/extension-manifest-loader').loadManifest(args);
    if (!extensionManifest) {
        console.log("★ Extension manifest not found. Aborting!");
        return null;
    } else {
        console.log("★ Extension manifest found");
        return extensionManifest;
    }
}

function loadAllManifests() {
    const manifests = require('../my-helpers/extension-manifest-loader').loadAllManifests();
    return manifests;
}

module.exports = {
    main            : main,
    invokeGulpTask  : invokeGulpTask,
    loadManifest    : loadManifest,
    loadAllManifests: loadAllManifests,
};


