require("./tasks/local-solc");
require("@nomicfoundation/hardhat-toolbox");

const { PRIVATE_KEY, BASESCAN_API_KEY, BASE_RPC_URL, BASE_SEPOLIA_RPC_URL } = process.env;

// Accounts are only attached when a key is present, so local tests need no secrets.
const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      // Base and Ethereum mainnet both support Cancun opcodes.
      evmVersion: "cancun",
      // Deterministic metadata keeps bytecode reproducible for source verification.
      metadata: { bytecodeHash: "none" },
    },
  },
  networks: {
    base: {
      url: BASE_RPC_URL || "https://mainnet.base.org",
      chainId: 8453,
      accounts,
    },
    baseSepolia: {
      url: BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      chainId: 84532,
      accounts,
    },
  },
  etherscan: {
    apiKey: { base: BASESCAN_API_KEY || "", baseSepolia: BASESCAN_API_KEY || "" },
  },
  sourcify: { enabled: true },
};
