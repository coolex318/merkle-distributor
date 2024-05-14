import { task } from "hardhat/config";

export default task("set-active", "Start a sale").setAction(
  async ({}, { deployments, getNamedAccounts, ethers }) => {
    const namedAccounts = await getNamedAccounts();

    console.log("namedAccounts: ", namedAccounts.deployer);

    const MerkleDistributorDeployment = await deployments.get(
      "MerkleDistributor"
    );
    const MerkleDistributorAddress = MerkleDistributorDeployment.address;
    console.log("MerkleDistributorAddress: ", MerkleDistributorAddress);

    const MerkleDistributorContract = await ethers.getContractAt(
      "MerkleDistributor",
      MerkleDistributorAddress
    );

    const tx = await MerkleDistributorContract.startSale();

    console.log("startSale tx: ", tx);
    const receipt = await tx.wait();
    console.log("startSale tx mined: ", receipt.transactionHash);
  }
);
