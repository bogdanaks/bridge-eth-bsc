import { ethers } from "hardhat";

async function main() {
  const Contract = await ethers.getContractFactory("Bridge");
  const [owner, addr1] = await ethers.getSigners();
  const contract = await Contract.deploy(addr1.address);

  console.log("Contract deployed to:", contract.address);
  console.log("Owner address is: ", owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
