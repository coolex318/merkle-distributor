import { BigNumber } from "ethers";
import { task } from "hardhat/config";
import { whitelist } from "../../scripts/whitelist";
import BalanceTree from "../balance-tree";

export default task("update-merkle", "Update merkle root").setAction(
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

    const balanceTree = new BalanceTree(
      whitelist.map((item) => ({
        account: item.account,
        amount: BigNumber.from(item.amount),
      }))
    );
    const tx = await MerkleDistributorContract.setMerkleRoot(
      balanceTree.getHexRoot(),
      {
        from: namedAccounts.deployer,
      }
    );

    console.log("update tx: ", tx);
    const receipt = await tx.wait();
    console.log("update tx mined: ", receipt.transactionHash);
  }
);
