/**
 * Update semantic release config with the new release branch.
 * @type {{branches: {}, plugins: {}}}
 */

const fs = require("fs");
const path = require("path");
const releaseConfig = require("../../../.releaserc.json");
const package = require("../../../package.json");

let releaseBranch = process.argv[2];
const version = package.version.split(".");

const releaseBranchConfig = {
  name: releaseBranch,
  prerelease: "build",
  channel: false,
};

/**
 * Following logic makes sure there are main + 2 latest release branches
 * in the semantic release config.
 * 1. Main branch is at index 0.
 * 2. New release config is inserted at the index 1 shifting all other releases
 * 3. Take first 3 branches from the array
 */
releaseConfig.branches.splice(1, 0, releaseBranchConfig);
releaseConfig.branches = releaseConfig.branches.slice(0, 3);

let data = JSON.stringify(releaseConfig, null, 2);
console.log("Inserting new release branch=", releaseBranchConfig);
const destination = path.resolve(__dirname, "../../../.releaserc.json");
fs.writeFile(destination, data, (err) => {
  if (err) throw err;
  console.log(`${destination} is saved.`);
});
