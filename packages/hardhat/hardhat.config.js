const { task } = require("hardhat/config");
const fs = require("fs");
const path = require("path");

require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("docgen", "Generate NatSpec", async (taskArgs, hre) => {
  const contractNames = await hre.artifacts.getAllFullyQualifiedNames();
  // TODO: get from config
  const ignore = ["console", "@openzeppelin"];
  contractNames
    .filter(
      (contractName) => !ignore.some((name) => contractName.includes(name))
    )
    .map(async (contractName) => {
      const [source, name] = contractName.split(":");
      const { metadata } = (await hre.artifacts.getBuildInfo(contractName))
        .output.contracts[source][name];

      const { abi, devdoc, userdoc } = JSON.parse(metadata).output;
      fs.writeFileSync(
        // TODO: move path to config
        path.resolve(__dirname, "..", "web", "contracts", `${name}.json`),
        JSON.stringify({ name, abi, devdoc, userdoc })
      );
      return { name, abi, devdoc, userdoc };
    });
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
    ],
  },
};
