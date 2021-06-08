import { task } from "hardhat/config";

import { PieAssetGetter__factory } from "../typechain/factories/PieAssetGetter__factory";


task("deploy-asset-getter")
    .addParam("globalRegistry")
    .addParam("smartPoolRegistry")
    .addParam("experiPieRegistry")
    .addParam("lendingRegistry")
    .setAction(async(taskArgs, {ethers}) => {

        const { globalRegistry, experiPieRegistry, smartPoolRegistry, lendingRegistry} = taskArgs;

        const signer = (await ethers.getSigners())[0];
        const factory = new PieAssetGetter__factory(signer);

        const assetGetter = await factory.deploy(
            globalRegistry,
            experiPieRegistry,
            smartPoolRegistry,
            lendingRegistry
        );

        console.log(`Asset getter deployed at: ${assetGetter.address}`);
        console.log(`Run: npx hardhat verify ${assetGetter.address} ${globalRegistry} ${experiPieRegistry} ${smartPoolRegistry} ${lendingRegistry}`);
});