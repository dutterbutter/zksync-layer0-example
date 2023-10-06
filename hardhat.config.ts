require("dotenv").config()

require("@matterlabs/hardhat-zksync-deploy")
require("@matterlabs/hardhat-zksync-solc")
require("hardhat-contract-sizer")
require("hardhat-gas-reporter")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("./tasks")


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    zksolc: {
        version: "latest",
        settings: {},
    },

    solidity: {
        compilers: [
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.7.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.8.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },

    namedAccounts: {
        deployer: {
            default: 0, // wallet address 0, of the mnemonic in .env
        },
        proxyOwner: {
            default: 1,
        },
    },

    mocha: {
        timeout: 100000000,
    },

    networks: {
        ethereum: {
            url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // public infura endpoint
            chainId: 1,
            accounts: [process.env.PRIVATE_KEY],
        },
        avalanche: {
            url: "https://api.avax.network/ext/bc/C/rpc",
            chainId: 43114,
            accounts: [process.env.PRIVATE_KEY],
        },
        polygon: {
            url: "https://rpc-mainnet.maticvigil.com",
            chainId: 137,
            accounts: [process.env.PRIVATE_KEY],
        },
        arbitrum: {
            url: `https://arb1.arbitrum.io/rpc`,
            chainId: 42161,
            accounts: [process.env.PRIVATE_KEY],
        },
        optimism: {
            url: `https://mainnet.optimism.io`,
            chainId: 10,
            accounts: [process.env.PRIVATE_KEY],
        },

        goerli: {
            url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // public infura endpoint
            chainId: 5,
            accounts: [process.env.PRIVATE_KEY],
        },
        mumbai: {
            url: "https://rpc-mumbai.maticvigil.com/",
            chainId: 80001,
            accounts: [process.env.PRIVATE_KEY],
        },
        "arbitrum-goerli": {
            url: `https://goerli-rollup.arbitrum.io/rpc/`,
            chainId: 421613,
            accounts: [process.env.PRIVATE_KEY],
        },
        "optimism-goerli": {
            url: `https://goerli.optimism.io/`,
            chainId: 420,
            accounts: [process.env.PRIVATE_KEY],
        },
        "fantom-testnet": {
            url: `https://rpc.ankr.com/fantom_testnet`,
            chainId: 4002,
            accounts: [process.env.PRIVATE_KEY],
        },
        "zksync-testnet": {
            url: `https://testnet.era.zksync.dev`,
            chainId: 280,
            accounts: [process.env.PRIVATE_KEY],
            zksync: true,
            ethNetwork: ""
        },
    },
}
