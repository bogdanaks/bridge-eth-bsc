import { parseEther, formatEther } from "ethers/lib/utils";
import { expect } from "chai";

export default function (): void {
  it("Swap: Swap token", async function (): Promise<void> {
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

    const balanceEthAfter = await this.tokenEth.balanceOf(this.owner.address);

    expect(formatEther(balanceEthAfter)).to.equal("900.0");
  });
}
