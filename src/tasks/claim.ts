import { BigNumber, constants } from "ethers";
import { task } from "hardhat/config";
import { whitelist } from "../../scripts/whitelist";
import BalanceTree from "../balance-tree";

export default task("claim", "Mint a token").setAction(
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

    const whitelistTree = whitelist.map((item) => ({
      account: item.account,
      amount: BigNumber.from(item.amount),
    }));

    const treeItemIdx = whitelistTree.findIndex(
      (item) =>
        item.account.toLowerCase() == namedAccounts.deployer.toLowerCase()
    );

    const balanceTree = new BalanceTree(whitelistTree);
    let merkleProof: string[] = [];
    let baseAmount = BigNumber.from("0");
    try {
      merkleProof = balanceTree.getProof(
        treeItemIdx,
        whitelistTree[treeItemIdx].account,
        whitelistTree[treeItemIdx].amount
      );
      baseAmount = whitelistTree[treeItemIdx].amount;
    } catch (e) {
      console.log(e);
      merkleProof = [];
    }

    console.log("merkleProof: ", merkleProof);

    const tx = await MerkleDistributorContract.claim(
      treeItemIdx >= 0 ? treeItemIdx : constants.MaxUint256,
      baseAmount,
      merkleProof
    );

    console.log("claim tx: ", tx);
    const receipt = await tx.wait();
    console.log("claim tx mined: ", receipt.transactionHash);
  }
);
