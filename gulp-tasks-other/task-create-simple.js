module.exports = function () {

    const gulp  = require('gulp');
    const args  = require('yargs').argv;
    const fs    = require("fs-extra");
    const path  = require("path");
    const debug = require("debug")("create-simple");

    /**
     * Create a simple structure for new module development
     * gulp create-simple -m admin-quick-task-in-email-alert
     */
    return gulp.task('create-simple', function () {

        const moduleName = args.m;

        const _json_ = {
            "version"  : "1.0.0",
            "finalName": moduleName,
            "shortName": moduleName
        };

        const manifestFile = JSON.stringify(_json_, undefined, 4);    //indent

        const changelogFileContent =
`## Release notice

### Version 1.0.0 − xx/xx/2021

- Initial release`;

        const homeEnv = process.env.OPEXDK_SRC_PATH;
        debug("★ homeEnv: ", homeEnv);
        const homes = homeEnv.split(",");
        const home  = homes.pop();
        debug(home);

        const pathToRoot   = path.join(home, moduleName);
        const pathToPublic = path.join(pathToRoot, 'public');
        const pathToModule = path.join(pathToPublic, 'module');

        fs.ensureDirSync(pathToModule);

        fs.ensureDirSync(path.join(pathToModule, 'admin'));
        fs.ensureDirSync(path.join(pathToModule, 'catalog'));
        fs.ensureDirSync(path.join(pathToModule, 'system'));
        fs.ensureDirSync(path.join(pathToModule, 'vqmod/xml'));
        fs.outputFileSync(path.join(pathToRoot, 'manifest.json'), manifestFile);
        fs.outputFileSync(path.join(pathToPublic, 'changelog.md'), changelogFileContent);

        console.log("Extension created in: ", pathToRoot);
        require('../lib/utils/opexdk-notifier').notify("Extension created!");
    });
}
