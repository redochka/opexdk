import * as gulp from 'gulp';
import {testArgs} from "../lib/utils/args-utils";
import {cu} from "../gulp-includes/common-utils-ts";
import {notify} from "../lib/utils/opexdk-notifier";

module.exports = function () {
    return gulp.task('test2', function () {

        console.log("cu is:", cu);

        let args = testArgs();
        console.log("args:", args);

        console.log("args m:", args.m);

        console.log("✔ Test task has run");

        notify("Extension should have been created!");

    });
}
