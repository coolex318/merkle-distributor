import { task } from "hardhat/config";

export default task("set-deactive", "Start a sale").setAction(
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

    const tx = await MerkleDistributorContract.endSale();

    console.log("endSale tx: ", tx);
    const receipt = await tx.wait();
    console.log("endSale tx mined: ", receipt.transactionHash);
  }
);
