import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import { ethers } from "hardhat";

export default function (): void {
  it("Redeem: Redeem token", async function (): Promise<void> {
    expect(
      await this.bridgeEth.swap(
        this.addr2.address,
        parseEther("100"),
        56,
        1,
        0,
        "CRYP"
      )
    )
      .to.emit(this.bridgeEth, "SwapInitialized")
      .withArgs(this.addr2.address, parseEther("100"), 56, 1, 0, "CRYP");

    const hashMsh = ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256", "uint256", "uint256", "string"],
      [this.addr2.address, parseEther("100"), 56, 1, 0, "CRYP"]
    );

    const signature = await this.owner.signMessage(
      ethers.utils.arrayify(hashMsh)
    );

    expect(await this.tokenBsc.balanceOf(this.addr1.address)).to.be.equal(0);
  });
}
