import { task } from "hardhat/config";

import "@nomiclabs/hardhat-ethers";

interface IArgs {
  contract: string;
  bridge: string;
}

task("grant-role", "Grant role bridge for token contract")
  .addParam("contract", "Contract token address")
  .addParam("bridge", "Contract bridge address")
  .setAction(async (args: IArgs, hre) => {
    const Token = await hre.ethers.getContractAt("Token", args.contract);

    const tx = await Token.grantRole(await Token.BRIDGE_ROLE(), args.bridge);
    await tx.wait();

    console.log("Successfully grant bridge role for token");
  });

export {};
