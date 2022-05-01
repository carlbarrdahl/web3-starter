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
  const ignore = ["console", "@openzeppelin"];
  console.log(contractNames);
  const abi = await Promise.all(
    contractNames
      .filter(
        (contractName) => !ignore.some((name) => contractName.includes(name))
      )
      // .filter((contractName) => !contractName.includes("@openzeppelin"))
      .map(async (contractName) => {
        const [source, name] = contractName.split(":");
        const { metadata } = (await hre.artifacts.getBuildInfo(contractName))
          .output.contracts[source][name];

        const { abi, devdoc, userdoc, ...rest } = JSON.parse(metadata).output;
        console.log(rest);
        fs.writeFileSync(
          path.resolve(__dirname, "..", "web", "contracts", `${name}.json`),
          JSON.stringify({ name, abi, devdoc, userdoc })
        );
        return { name, abi, devdoc, userdoc };
        // console.log(JSON.stringify({ abi, devdoc, userdoc }, null, 2));
      })
  );

  console.log(abi);
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
