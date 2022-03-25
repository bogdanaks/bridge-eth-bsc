import { parseEther } from "ethers/lib/utils";
import { task } from "hardhat/config";

import "@nomiclabs/hardhat-ethers";

interface IArgs {
  contract: string;
  amount: string;
}

task("mint", "Mint tokens")
  .addParam("contract", "Contract token address")
  .addParam("amount", "Amount")
  .setAction(async (args: IArgs, hre) => {
    const Token = await hre.ethers.getContractAt("Token", args.contract);
    const [owner] = await hre.ethers.getSigners();

    const tx = await Token.mint(owner.address, parseEther(args.amount));
    await tx.wait();

    console.log("Successfully mint token");
  });

export {};
