import { task } from "hardhat/config";
import ethers from "ethers";
import * as dotenv from "dotenv";

import "@nomiclabs/hardhat-ethers";

dotenv.config();
interface IArgs {
  contract: string;
  recipient: string;
  amount: string;
  chainfrom: string;
  chainto: string;
  nonce: string;
  symbol: string;
}

task("redeem", "Redeem token")
  .addParam("contract", "Contract address")
  .addParam("recipient", "Recipient address")
  .addParam("amount", "Amount to swap")
  .addParam("chainfrom", "Chain from id")
  .addParam("chainto", "Chain toid ")
  .addParam("nonce", "Unique value")
  .addParam("symbol", "Symbol of token")
  .setAction(async (args: IArgs, hre) => {
    const Bridge = await hre.ethers.getContractAt("Bridge", args.contract);
    const [owner] = await hre.ethers.getSigners();

    const hashMsh = ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256", "uint256", "uint256", "string"],
      [
        args.recipient,
        args.amount,
        args.chainfrom,
        args.chainto,
        args.nonce,
        args.symbol,
      ]
    );

    const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY);
    const signature = await wallet.signMessage(ethers.utils.arrayify(hashMsh));

    const tx = await Bridge.connect(owner).redeem(
      args.recipient,
      args.amount,
      args.chainfrom,
      args.chainto,
      args.nonce,
      args.symbol,
      signature
    );
    await tx.wait();

    console.log("Successfully redeem token");
  });

export {};
