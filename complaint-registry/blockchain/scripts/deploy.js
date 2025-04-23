const hre = require("hardhat");

async function main() {
  const ComplaintContract = await hre.ethers.getContractFactory("ComplaintContract");
  const complaintContract = await ComplaintContract.deploy();
  await complaintContract.waitForDeployment();

  console.log("ComplaintContract deployed to:", await complaintContract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
