import { task } from "hardhat/config";

import "@nomiclabs/hardhat-ethers";

interface IArgs {
  contract: string;
  tokensymbol: string;
  tokenaddress: string;
}

task("include-token", "Include token")
  .addParam("contract", "Contract address")
  .addParam("tokensymbol", "Token symbol")
  .addParam("tokenaddress", "Token address")
  .setAction(async (args: IArgs, hre) => {
    const Bridge = await hre.ethers.getContractAt("Bridge", args.contract);

    const tx = await Bridge.includeToken(args.tokensymbol, args.tokenaddress);
    await tx.wait();

    console.log("Successfully include token in bridge");
  });

export {};
