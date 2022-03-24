import { parseEther } from "ethers/lib/utils";
import { expect } from "chai";
import { ethers } from "hardhat";

export default function (): void {
  it("Errors: Identical networks", async function (): Promise<void> {
    expect(
      this.bridgeEth.swap(
        this.addr2.address,
        parseEther("100"),
        1,
        1,
        0,
        "CRYP"
      )
    ).to.be.revertedWith("Identical networks");

    expect(
      this.bridgeEth.redeem(
        this.addr2.address,
        parseEther("100"),
        1,
        1,
        0,
        "CRYP",
        "none"
      )
    ).to.be.revertedWith("Identical networks");
  });

  it("Errors: Swap. Already processing", async function (): Promise<void> {
    await this.bridgeEth.swap(
      this.addr2.address,
      parseEther("100"),
      56,
      1,
      0,
      "CRYP"
    );

    expect(
      this.bridgeEth.swap(
        this.addr2.address,
        parseEther("100"),
        56,
        1,
        0,
        "CRYP"
      )
    ).to.be.revertedWith("Already processing");
  });

  it("Errors: Redeem. Already processing", async function (): Promise<void> {
    await this.bridgeEth.swap(
      this.addr2.address,
      parseEther("100"),
      56,
      1,
      0,
      "CRYP"
    );
    const hashMsh = ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256", "uint256", "uint256", "string"],
      [this.addr2.address, parseEther("100"), 56, 1, 0, "CRYP"]
    );
    const signature = await this.validator.signMessage(
      ethers.utils.arrayify(hashMsh)
    );

    await this.bridgeBsc.redeem(
      this.addr2.address,
      parseEther("100"),
      56,
      1,
      0,
      "CRYP",
      signature
    );

    expect(
      this.bridgeBsc.redeem(
        this.addr2.address,
        parseEther("100"),
        56,
        1,
        0,
        "CRYP",
        signature
      )
    ).to.be.revertedWith("Already processing");
  });

  it("Errors: Swap Token does not exist", async function (): Promise<void> {
    expect(
      this.bridgeEth.swap(
        this.addr2.address,
        parseEther("100"),
        56,
        1,
        0,
        "CRYP_FAIL"
      )
    ).to.be.revertedWith("Token does not exist");
  });

  it("Errors: Redeem Token does not exist", async function (): Promise<void> {
    await this.bridgeEth.swap(
      this.addr2.address,
      parseEther("100"),
      56,
      1,
      0,
      "CRYP"
    );
    const hashMsh = ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256", "uint256", "uint256", "string"],
      [this.addr2.address, parseEther("100"), 56, 1, 0, "CRYP"]
    );
    const signature = await this.validator.signMessage(
      ethers.utils.arrayify(hashMsh)
    );

    expect(
      this.bridgeBsc.redeem(
        this.addr2.address,
        parseEther("100"),
        56,
        1,
        0,
        "CRYP_FAIL",
        signature
      )
    ).to.be.revertedWith("Token does not exist");
  });

  it("Errors: Validator address is not correct", async function (): Promise<void> {
    await this.bridgeEth.swap(
      this.addr2.address,
      parseEther("100"),
      56,
      1,
      0,
      "CRYP"
    );

    expect(
      this.bridgeBsc.redeem(
        this.addr2.address,
        parseEther("100"),
        56,
        1,
        0,
        "CRYP",
        "fail_signature"
      )
    ).to.be.revertedWith("Validator address is not correct");
  });
}
