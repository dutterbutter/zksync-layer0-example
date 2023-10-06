# 🌐 OmniCounter Example using LayerZero and zkSync 

Learn how to send a cross-chain message from `optimism-goerli` to `zksync-testnet`.

## 🛠 Installation

### Prerequisites
1. NodeJS & Yarn installed.
2. Wallets funded on both `optimism-goerli` and `zksync-testnet` networks.

### Install Dependencies
Run the following command to install required dependencies:
```bash
yarn install
```

### Environment Setup
Create a `.env` file at the project root with your `PRIVATE_KEY`:
```env
PRIVATE_KEY=""
```

## 🚀 Example

OmniCounter is a simplistic contract that incorporates a counter. The only way to increment this counter is *remotely*!

### Step 1: Deploy OmniCounters

Deploy the contract on both networks:

```bash
npx hardhat --network zksync-testnet deploy --tags OmniCounter
npx hardhat --network optimism-goerli deploy --tags OmniCounter
```

### Step 2: Configure Remote Addresses

Establish trust between contracts to enable message reception:

```bash
npx hardhat --network zksync-testnet setTrustedRemote --target-network optimism-goerli --contract OmniCounter
npx hardhat --network optimism-goerli setTrustedRemote --target-network zksync-testnet --contract OmniCounter
```

### Step 3: Send Cross-Chain Message

Time to send a cross-chain message from `optimism-goerli` to `zksync-testnet`:

```bash
npx hardhat --network optimism-goerli incrementCounter --target-network zksync-testnet
```

## 🌐 Official Links

- 🌍 [Website](https://zksync.io/)
- 📚 [Documentation](https://v2-docs.zksync.io/dev/)
- 🖥 [GitHub](https://github.com/matter-labs)
- 🐦 [Twitter](https://twitter.com/zksync)
- 💬 [Discord](https://discord.gg/nMaPGrDDwk)

---

Feel free to adapt or extend as needed!