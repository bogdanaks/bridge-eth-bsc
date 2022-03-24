import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import swapTest from "./swap";
import redeemTest from "./redeem";

describe("Test functions", async function () {
  before(async function () {
    this.BridgeContract = await ethers.getContractFactory("Bridge");
    this.TokenContract = await ethers.getContractFactory("Token");
    [this.owner, this.addr1, this.addr2] = await ethers.getSigners();

    this.bridgeEth = await this.BridgeContract.deploy();
    this.bridgeBsc = await this.BridgeContract.deploy();
    this.tokenEth = await this.TokenContract.deploy("Crypton ETH", "CRYP");
    this.tokenBsc = await this.TokenContract.deploy("Crypton BSC", "CRYP");

    await this.tokenEth.grantRole(
      await this.tokenEth.BRIDGE_ROLE(),
      this.bridgeEth.address
    );
    await this.tokenBsc.grantRole(
      await this.tokenBsc.BRIDGE_ROLE(),
      this.bridgeBsc.address
    );

    await this.tokenEth.mint(this.owner.address, parseEther("1000"));
    await this.bridgeEth.includeToken("CRYP", this.tokenEth.address);
    await this.bridgeBsc.includeToken("CRYP", this.tokenBsc.address);
  });

  swapTest();
  redeemTest();
});
