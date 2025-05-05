const hre = require("hardhat");

async function main() {
  const ComplaintContract = await hre.ethers.getContractFactory("ComplaintContract");
  const complaintContract = await ComplaintContract.deploy();
  await complaintContract.waitForDeployment();

  console.log("ComplaintContract deployed to:", await complaintContract.getAddress());

  // 🔍 Tenderly Verification (optional, but helpful)
  // await hre.tenderly.verify({
  //   name: "ComplaintContract",
  //   address: await complaintContract.getAddress(),
  // });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
