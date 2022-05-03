const { task } = require("hardhat/config");
const fs = require("fs");
const path = require("path");

require("hardhat-deploy");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("docgen", "Generate NatSpec", async (taskArgs, hre) => {
  const config = hre.config.docgen;
  const contractNames = await hre.artifacts.getAllFullyQualifiedNames();
  await Promise.all(
    contractNames
      .filter(
        (contractName) =>
          !(config.ignore || []).some((name) => contractName.includes(name))
      )
      .map(async (contractName) => {
        const [source, name] = contractName.split(":");
        const { metadata } = (await hre.artifacts.getBuildInfo(contractName))
          .output.contracts[source][name];

        const { abi, devdoc, userdoc } = JSON.parse(metadata).output;

        fs.writeFileSync(
          path.resolve(__dirname, ...config.path, `${name}.json`),
          JSON.stringify(
            { name, abi, devdoc, userdoc },
            null,
            config.prettify ? 2 : 0
          )
        );
        return { name, abi, devdoc, userdoc };
      })
  );
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
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  docgen: {
    ignore: ["console", "@openzeppelin"],
    path: ["..", "web", "contracts"],
    prettify: true,
  },
};
