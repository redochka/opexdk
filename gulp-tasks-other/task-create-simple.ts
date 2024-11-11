import gulp from "gulp";
import fs from "fs-extra";
import path from "path";
import debug from "debug";
import 'colorts/lib/string'
import {createSimpleArgs} from "../lib/utils/args-utils";

module.exports = function () {

  const d = debug("create-simple");

  /**
   * Create a simple structure for new module development
   * gulp create-simple -m admin-quick-task-in-email-alert
   */
  gulp.task('create-simple', function () {
    const args = createSimpleArgs();
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
    d(`homeEnv: ${homeEnv}`.red);
    const homes = homeEnv.split(",");
    const home = homes.pop();
    d(`home folder is ${home}`.red);

    const pathToRoot = path.join(home, moduleName);
    const pathToPublic = path.join(pathToRoot, 'public');
    const pathToModule = path.join(pathToPublic, 'module');

    fs.ensureDirSync(pathToModule);

    fs.ensureDirSync(path.join(pathToModule, 'admin'));
    fs.ensureDirSync(path.join(pathToModule, 'catalog'));
    fs.ensureDirSync(path.join(pathToModule, 'system'));
    fs.ensureDirSync(path.join(pathToModule, 'vqmod/xml'));
    fs.outputFileSync(path.join(pathToRoot, 'manifest.json'), manifestFile);
    fs.outputFileSync(path.join(pathToPublic, 'changelog.md'), changelogFileContent);

    console.log("Extension created in: ".green, pathToRoot);
    require('../lib/utils/opexdk-notifier').notify("Extension created!");
  });
}
