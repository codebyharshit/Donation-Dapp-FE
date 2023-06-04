const hre = require("hardhat");

async function main() {
  const DonationDapp = await ethers.getContractFactory("DonationDapp");
  const donationDapp = await DonationDapp.deploy(
    ethers.utils.parseEther("0.1")
  );

  await donationDapp.deployed();

  console.log("donation dapp deployed to:", donationDapp.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
