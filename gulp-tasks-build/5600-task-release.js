const args    = require('yargs').argv;
if(args.vv) console.log(("Loading " + __filename).grey);

module.exports = function(extension){

    const gulp = require('gulp');
    const git  = require('gitty');
    const cu   = require("../gulp-includes/common-utils.js");
    const path = require("path");

    /**
     * Package and commit to know changelog from git log and tag so that we can package at any time.
     */
    gulp.task('release', gulp.series('package', function (done) {

        console.log("★ Running release task");
        const extensionRepoAbsPath = path.resolve(extension.dir, "../");
        console.log("extensionRepoAbsPath: ", extensionRepoAbsPath);

        const repo = git(extensionRepoAbsPath);

        const dirs     = cu.getExtensionAndDepsDirs(extension);
        const filesArr = cu.addSuffixToDirs(dirs, "/.");


        const tag = function(){
            repo.createTag(extension.finalName + '@' + extension.version, function (err) {
                if(err) {
                    console.log("✘ Error when creating tag.", err);
                    throw err;
                }
            });
        };

        const commit = function(){
            repo.commit(`Released ${extension.finalName}@${extension.version}`, function(err){
                if(err) throw err;

                const zipLocation = path.join(cu.getZipsDirAbsPath(), cu.getPublicNameOfDelivery(extension) + '.zip');
                console.log("Released! Check your package in: " + zipLocation);
                tag();
            });
        };

        repo.add(filesArr, function(err){
            if(err) throw err;
            commit();
        });

        done();
    }));

}

if(args.vv) console.log("task-release: loaded");
