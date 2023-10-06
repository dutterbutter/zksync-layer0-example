const CHAIN_ID = require("../constants/chainIds.json");
const { Contract } = require("ethers");
const { Wallet, Provider } = require("zksync-web3");
const { getDeploymentAddresses } = require("../utils/readStatic");

const ZKSYNC_OMNICOUNTER = "YOUR-ZKSYNC-DEPLOYED-OMNICOUNTER-ADDRESS";

// fetch the contract ABI from the artifacts folder
// only used if the target network is zksync-testnet
const fetchContractABI = () => {
  const ContractArtifact = require("../artifacts-zk/contracts/examples/OmniCounter.sol/OmniCounter.json");
  return ContractArtifact.abi;
};

// initialize the contract with ethers
// only used if the target network is zksync-testnet
const initializeLocalContract = (abi, signer) =>
  new Contract(ZKSYNC_OMNICOUNTER, abi, signer);

const logTransaction = (hre, remoteChainId, remoteAndLocal, txHash) => {
  console.log(
    `✅ [${hre.network.name}] setTrustedRemote(${remoteChainId}, ${remoteAndLocal})`
  );
  console.log(` tx: ${txHash}`);
};

module.exports = async function(taskArgs, hre) {
  const { targetNetwork, contract, localContract, remoteContract } = taskArgs;

  const contractName = contract || localContract;
  const remoteName = contract || remoteContract;

  if (!contractName || !remoteName) {
    console.log(
      "Must pass in contract name OR pass in both localContract name and remoteContract name"
    );
    return;
  }

  const provider =
    targetNetwork !== "zksync-testnet"
      ? new Provider("https://testnet.era.zksync.dev")
      : null;
  const signer = provider
    ? new Wallet(process.env.PRIVATE_KEY, provider)
    : null;

  // if the target network is not zksync-testnet, then we can use ethers hardhat to get the contract
  // otherwise, we need to initialize the contract with ethers
  const localContractInstance =
    targetNetwork !== "zksync-testnet"
      ? initializeLocalContract(fetchContractABI(), signer)
      : await ethers.getContract(contractName);

  // if the target network is zksync-testnet, then we use hardcoded contract address
  // otherwise, we can fetch the deployment address from the deployment json which includes the address
  // zksync-hardhat-deploy does not provide the address in the deployment json
  const remoteAddress =
    targetNetwork === "zksync-testnet"
      ? ZKSYNC_OMNICOUNTER
      : getDeploymentAddresses(targetNetwork)[remoteName];

  const remoteChainId = CHAIN_ID[targetNetwork];
  const remoteAndLocal = hre.ethers.utils.solidityPack(
    ["address", "address"],
    [remoteAddress, localContractInstance.address]
  );

  const isTrustedRemoteSet = await localContractInstance.isTrustedRemote(
    remoteChainId,
    remoteAndLocal
  );

  if (!isTrustedRemoteSet) {
    try {
      const tx = await localContractInstance.setTrustedRemote(
        remoteChainId,
        remoteAndLocal
      );
      await tx.wait();
      logTransaction(hre, remoteChainId, remoteAndLocal, tx.transactionHash);
    } catch (e) {
      const errorMsg = e.error.message;
      if (errorMsg.includes("The chainId + address is already trusted")) {
        console.log("*source already set*");
      } else {
        console.log(
          `❌ [${hre.network.name}] setTrustedRemote(${remoteChainId}, ${remoteAndLocal})`
        );
      }
    }
  } else {
    console.log("*source already set*");
  }
};
