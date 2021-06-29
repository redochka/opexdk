const args = require('yargs').argv;
const path = require('path');
const log  = require('fancy-log');

module.exports = {

    getExtSkeletonsAbsPath: function () {
        console.log("dirname: ", __dirname);
        const s = path.resolve(__dirname, "../assets/extension_skeletons");
        console.log("ExtSkeletonsAbsPath: ", s);
        return s;
    },

    getDistSkeletonAbsPath: function () {
        console.log("dirname: ", __dirname);
        const s = path.resolve(__dirname, "../assets/dist_skel");
        console.log("DistSkeletonPath: ", s);
        return s;
    },

    getPublicNameOfDelivery: function (extension) {

        /*
         *
         */
        let adminFolderSuffix = "";
        if (args.admin) {
            console.log("★ Admin folder: " + args.admin);
            adminFolderSuffix = "-" + args.admin;
        }

        /*
         *
         */
        return extension.finalName + '-version-' + extension.version + adminFolderSuffix;
    },

    /**
     * This is the output directory when opexdk will pack the extension.
     * Use OPEX_OUTPUT_DIR env variable if provided, otherwise defaults to /tmp/opexdk-output
     * @returns {string}
     */
    getOutputDirAbsPath: function () {
        if (process.env.OPEXDK_OUTPUT_DIR) {
            return process.env.OPEX_OUTPUT_DIR;
        } else {
            const os = require('os');
            return path.join(os.tmpdir(), "opexdk-output");
        }
    },

    getBuildDirAbsPath: function () {
        return path.join(this.getOutputDirAbsPath(), "build");
    },

    getDistDirAbsPath: function () {
        return path.join(this.getOutputDirAbsPath(), "dist");
    },

    getZipsDirAbsPath: function () {
        return path.join(this.getOutputDirAbsPath(), "zips");
    },

    getPathToExtensionBuildFolder: function (extensionFinalName, extension) {
        return path.join(this.getBuildDirAbsPath(), extension.private_build_dir, extensionFinalName);
    },


    getPathToExtensionDistFolder: function (extensionFinalName, extension) {
        return path.join(this.getDistDirAbsPath(), `${extension.private_dist_dir}/${extensionFinalName}`);
    },

    getPathToExtensionOcmodDistFolder: function (extensionFinalName, extension) {
        return this.getPathToExtensionDistFolder(extensionFinalName, extension) + "/ocmod-oneclick-install";
    },


    getPathToExtensionLegacyDistFolder: function (extensionFinalName, extension) {
        return this.getPathToExtensionDistFolder(extensionFinalName, extension) + "/vqmod-legacy-install";
    },

    getNameOfFullZip : function (finalName) {
        return `${finalName}.full.zip`;
    },
    getNameOfCloudZip: function (finalName) {
        return `${finalName}.cloud.nodoc.ocmod.zip`;
    },

    /**
     *
     */
    getExtensionAndDepsDirs: function (extension) {

        /*
         *
         */
        if (!extension.dependencies) {
            return [extension.dir];  //arr
        }

        /*
         *
         */
        const result    = [];
        const parentDir = path.resolve(extension.dir + "/..");  //parent dir

        extension.dependencies.forEach(function (depDirName) {
            console.log("★ Dep is: ", depDirName);

            if (depDirName.indexOf('!') >= 0) {
                console.log("★ dep contains `!`. Ignoring!");
                return;
            }

            let dependencyManifest = require('../my-helpers/extension-manifest-loader').loadManifest({
                "m": path.basename(depDirName)
            });

            console.log("★ extensionManifest of dependency was loaded: ", dependencyManifest);
            if (dependencyManifest.dependencies) {
                let deps = module.exports.getExtensionAndDepsDirs(dependencyManifest);
                result.push(...deps);
            } else {
                // let libAbsDir = path.join(parentDir, depDirName);
                let libAbsDir = dependencyManifest.dir;
                result.push(libAbsDir);
            }

        });

        result.push(extension.dir);
        return result;
    },


    addSuffixToDirs: function (dirs, suffix) {

        const result = [];

        dirs.forEach(function (dir) {
            result.push(dir + suffix);
        });

        return result;
    },


    getPathToVhost: function (manifest) {
        let ocFolder;
        if (args.o) {
            ocFolder = args.o;
        } else if (manifest.devSpec && manifest.devSpec.watchTask && manifest.devSpec.watchTask.defaultTarget) {
            ocFolder = manifest.devSpec.watchTask.defaultTarget;
        }

        if (ocFolder) {
            return path.join(process.env.OPEXDK_VHOST_PATH, ocFolder);
        } else {
            log.error("Please specify -o flag or defaultTarget in extension manifest!");
        }
    }
}