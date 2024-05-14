import { task } from "hardhat/config";

export default task("mint", "Mint a token")
  .addParam("amount", "The number of tokens")
  .addParam("ethAmount", "The number of ETH tokens")
  .setAction(
    async (
      { amount, ethAmount },
      { deployments, getNamedAccounts, ethers }
    ) => {
      const namedAccounts = await getNamedAccounts();

      console.log("amount: ", amount);
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

      const tx = await MerkleDistributorContract.mint(amount, {
        value: ethAmount,
      });

      console.log("mint tx: ", tx);
      const receipt = await tx.wait();
      console.log("mint tx mined: ", receipt.transactionHash);
    }
  );
