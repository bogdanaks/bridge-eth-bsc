// import { parseEther, formatEther } from "ethers/lib/utils";
import { expect } from "chai";

export default function (): void {
  it("Token: Include token", async function (): Promise<void> {
    await this.bridgeEth.includeToken("SOME", this.addr2.address);
    expect(
      this.bridgeEth.connect(this.addr1).includeToken("SOME", "some_address")
    ).to.be.revertedWith("Only owner");
  });

  it("Token: Exclude token", async function (): Promise<void> {
    await this.bridgeEth.includeToken("SOME", this.addr2.address);
    expect(
      this.bridgeEth.connect(this.addr1).excludeToken("SOME")
    ).to.be.revertedWith("Only owner");
    await this.bridgeEth.excludeToken("SOME");
  });

  it("Token: Update chain", async function (): Promise<void> {
    await this.bridgeEth.updateChainById(2, true);
    expect(
      this.bridgeEth.connect(this.addr1).updateChainById(2, false)
    ).to.be.revertedWith("Only owner");
  });
}
