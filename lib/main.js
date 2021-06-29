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

    const args = require('yargs').argv;

    debug('main arg: ', args._);
    const task = args._.length > 0 ? args._[0] : args.t

    debug("task is: ", task);

    if (!task) {
        console.error("✘ no task specified. Aborting!");
        return;
    }

    invokeGulpTask(task);
}

function invokeGulpTask(task, slug = null) {

    const gulp = require('gulp');
    const gulpfile = require('../gulpfile');
    gulpfile.loadTasks(slug);

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


