let walker = require("./locate-extensions-dirs-with-walkdir");

let paths = walker.getExtensionsPathsWithWalk();
console.log("paths: ", paths);