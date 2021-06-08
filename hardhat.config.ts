require("dotenv").config();

import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";

// Only when not compiling
if(!process.env.COMPILE_ONLY) {
  require("./tasks/deploy");
}

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: {
    compilers: [
      {
        version: "0.8.1"
      },
      {
        version: "0.7.1"
      }
    ]
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    hardhat: {
      forking: {
        url: process.env["MAINNET_FORK"] || "https://sandbox.truffleteams.com/d4ce5da1-5170-42e7-a399-eaddaf36b62c" 
      }
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_KEY
  }
};

