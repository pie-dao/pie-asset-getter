import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { task } from "hardhat/config";
import env from 'hardhat';

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
    hardhat: {
      forking: {
        url: process.env["MAINNET_FORK"] || "https://sandbox.truffleteams.com/79800802-d2cd-4262-a354-93fc82bb0467" 
      }
    }
  }
};

