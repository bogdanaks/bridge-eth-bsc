import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("NFT");
  const contract = await Contract.deploy();
  const [owner] = await ethers.getSigners();

  console.log("Contract deployed to:", contract.address);
  console.log("Owner address is: ", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
