import { task } from "hardhat/config";
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

task("swap", "Swap token")
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

    const tx = await Bridge.swap(
      args.recipient,
      args.amount,
      args.chainfrom,
      args.chainto,
      args.nonce,
      args.symbol
    );
    await tx.wait();

    const provider = new hre.ethers.providers.WebSocketProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545"
    );
    const filter = Bridge.filters.SwapInitialized(
      args.recipient,
      null,
      null,
      null,
      null,
      null
    );
    provider.on(filter, (event) =>
      console.log("SwapInitialized event:", event)
    );

    console.log("Successfully swap token");
  });

export {};
