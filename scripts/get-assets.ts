// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { IPieRegistry } from "../typechain/IPieRegistry";
import { PieAssetGetter } from "../typechain/PieAssetGetter";

const GLOBAL_REGISTRY = "0x412a5d5eC35fF185D6BfF32a367a985e1FB7c296"; // all pies :)
const SMART_POOL_REGISTRY = "0xE0CBd9db30E15B9ad885D39AecaE138616807753"; // smart pools
const EXPERIPIE_REGISTRY = "0x63aafCF1F184A6A682f781c15A6436Ebd7D1C7ed"; // experipies
const LENDING_REGISTRY = "0x9a607dd7Da5fdABf4f53f73a476D99F68172C36D"; // lending registry

const DEFI_PP = "0x8d1ce361eb68e9e05573443c407d4a3bed23b033"; // smart pool
const DEFI_PL = "0x78f225869c08d478c34e5f645d07a87d3fe8eb78" // experipie
const YPIE = "0x17525E4f4Af59fbc29551bC4eCe6AB60Ed49CE31"; // ypie
const PLAY = "0x33e18a092a93ff21ad04746c7da12e35d34dc7c4"; // play

async function registryPresence(address: string, symbol: string, registryAddress: string, registryName: string) {
  const registry = await ethers.getContractAt("IPieRegistry", registryAddress) as IPieRegistry;
  const inRegistry = await registry.inRegistry(address);

  console.log(symbol + " in " + registryName + " registry: " + inRegistry);
}

async function getRegitriesPresence(address: string, symbol: string) {
  await registryPresence(address, symbol, GLOBAL_REGISTRY, "Global Registry");
  await registryPresence(address, symbol, SMART_POOL_REGISTRY, "Smart Pool Registry");
  await registryPresence(address, symbol, EXPERIPIE_REGISTRY, "ExperiPie Registry");
}

async function getAssetsAndAmounts(assetGetter: PieAssetGetter, pie: string, pieName: string) {
  console.log("Fetching assets and amount for 1 " + pieName);

  const [tokens, amounts] = await assetGetter.callStatic.getAssetsAndAmounts(pie);

  for(let i = 0; i < tokens.length; i++) {
    console.log(tokens[i] + " " + ethers.BigNumber.from(amounts[i]));
  }

  console.log("\n");
}

async function main() {
  const Getter = await ethers.getContractFactory("PieAssetGetter");
  const assetGetter = await Getter.deploy(GLOBAL_REGISTRY, EXPERIPIE_REGISTRY, SMART_POOL_REGISTRY, LENDING_REGISTRY) as PieAssetGetter;

  await getAssetsAndAmounts(assetGetter, DEFI_PL, "DEFI+L"); // DEFI+L
  await getAssetsAndAmounts(assetGetter, DEFI_PP, "DEFI++"); // DEFI++
  await getAssetsAndAmounts(assetGetter, YPIE, "YPIE"); // YPIE
  await getAssetsAndAmounts(assetGetter, PLAY, "PLAY"); // PLAY

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
