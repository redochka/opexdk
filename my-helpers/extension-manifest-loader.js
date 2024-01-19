const fs = require("fs-extra");
const debug = require('debug')('manifestLoader');

function loadManifest(args) {

  let _shortName = args.m;

  if (!_shortName) {
    console.log("Required param args.m not found. Aborting!");
    return;
  }

  const extensionDir = require('./locate-extension-dir-with-walkdir').getExtensionPathWithWalk(args);

  if (!extensionDir) {
    console.log("Extension directory not found.");
    return null;
  }

  debug('★ Extension dir: ', extensionDir);

  return loadManifestFromPath(extensionDir);
}

function loadAllManifests() {
  const extensionsPaths = require('./locate-extensions-dirs-with-walkdir').getExtensionsPathsWithWalk();
  let manifests = [];
  for (const extensionsPath of extensionsPaths) {
    manifests.push(loadManifestFromPath(extensionsPath));
  }
  return manifests;
}

/**
 * Load manifest.json or deprecated gulpfile.js
 */
function loadManifestFromPath(extensionPath) {
  let manifestPath = extensionPath + '/manifest.json';
  if (!fs.existsSync(manifestPath)) {
    manifestPath = extensionPath + '/gulpfile.js';
  }

  /*
   *
   */
  const extensionManifest = require(manifestPath);
  extensionManifest.dir = extensionPath;

  return extensionManifest;
}

/**
 *
 */
module.exports = {
  loadManifest    : loadManifest,
  loadAllManifests: loadAllManifests,
};
