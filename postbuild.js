// Copy the client into the server
// Copying everything into a build folder in the root would require having @monopoly-money/game-state as a dependency in the root.
// This would create a circular dependency and cause issues. Instead we just use the server package build as our build that we run.

const fs = require("fs");
const path = require("path");

const clientSource = "packages/client/build";
const serverDestination = "packages/server/build/client";

function deleteFolderRecursive(folderPath) {
  // src: https://stackoverflow.com/a/20920795
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(function (file) {
      var curPath = folderPath + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

function copyRecursiveSync(src, dest) {
  // src: https://stackoverflow.com/a/22185855
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Make sure destination is empty
if (fs.existsSync(serverDestination)) {
  deleteFolderRecursive(serverDestination);
}

// Copy the built client
copyRecursiveSync(clientSource, serverDestination);
