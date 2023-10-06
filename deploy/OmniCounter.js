require("dotenv").config();
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const { Wallet } = require("zksync-web3");
const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json");

function getEndpointAddress(networkName) {
  return LZ_ENDPOINTS[networkName];
}

// Deployment function for zkSync network
async function deployOnZkSync(deployer, hre) {
  const artifact = await deployer.loadArtifact("OmniCounter");
  const endpointAddr = getEndpointAddress(hre.network.name);
  const omniCounterContract = await deployer.deploy(artifact, [endpointAddr]);
  console.log(
    `${artifact.contractName} was deployed to ${omniCounterContract.address}`
  );
}

// Deployment function for other networks
async function deployOnOtherNetworks(deployments, getNamedAccounts, hre) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const endpointAddr = getEndpointAddress(hre.network.name);

  await deploy("OmniCounter", {
    from: deployer,
    args: [endpointAddr],
    log: true,
    waitConfirmations: 1,
  });
}

module.exports = async function({ deployments, getNamedAccounts, hre }) {
  const networkName = deployments.getNetworkName();
  console.log(`Deploying to network: ${networkName}`);

  const endpointAddr = getEndpointAddress(hre.network.name);
  console.log(`[${hre.network.name}] Endpoint address: ${endpointAddr}`);

  if (networkName === "zksync-testnet") {
    const wallet = new Wallet(process.env.PRIVATE_KEY);
    const deployer = new Deployer(hre, wallet);
    console.log(`Deployer address: ${deployer.address}`);
    await deployOnZkSync(deployer, hre);
  } else {
    console.log(`Deployer address: ${await getNamedAccounts().deployer}`);
    await deployOnOtherNetworks(deployments, getNamedAccounts, hre);
  }
};

module.exports.tags = ["OmniCounter"];
