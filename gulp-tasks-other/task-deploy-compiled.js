const debug = require("debug")("deploy-compiled");

module.exports = function (extension) {

    const gulp = require('gulp');
    const cu   = require("../gulp-includes/common-utils.js");
    const args = require('yargs').argv;

    /**
     * gulp deploy-compiled -m tsp --sandbox -o '/tmp/'
     * gulp deploy-compiled -m tsp --sandbox -o '/home/reda/www/demo/opencart/demo_occhi/'
     * gulp deploy-compiled -m tsp-email-piping --sandbox -o '/home/reda/www/demo/opencart/demo_occhi/'
     * gulp deploy-compiled -m colorify -o '/home/reda/www/demo/opencart/demo_colorify_oc1'
     gulp deploy-compiled -m hidereg3 -o '/home/reda/www/demo/opencart/demo_hidereg_oc2'
     * --sandbox : pour créer un répertoire unique et éviter des problèmes lorsque deux créations de site de démo ont lieu en même temps.
     * -o : c'est le chemin vers le site opencart de démo vers lequel on deploy.
     *
     * Grâce à cette tâche, les pagese d'admin des extensions sur le site de démo auront un vrai numéro de version.
     * et ça permettra de déployer une extension et ses dépendances !
     */
    gulp.task('deploy-compiled', gulp.series('package', function () {

        debug("Entering deploy-compiled task");

        if (args.vq2oc2sys) {
            console.error("✘ vq2oc2sys is not yet supported");
        }

        const FINAL_FILENAME              = cu.getPublicNameOfDelivery(extension);
        const MY_VQMOD_LEGACY_DIST_FOLDER = cu.getPathToExtensionLegacyDistFolder(FINAL_FILENAME, extension);

        let dist = cu.getPathToVhost(extension);
        return gulp.src(`${MY_VQMOD_LEGACY_DIST_FOLDER}/upload/**/*`).pipe(gulp.dest(dist));
    }));

}
