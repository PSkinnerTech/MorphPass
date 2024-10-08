require("dotenv").config();

require("@nomicfoundation/hardhat-toolbox");

const config = {
    solidity: {
      version: "0.8.24",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        evmVersion: "london"
      }
    },
  networks: {
    morphTestnet: {
      url: process.env.MORPH_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 2000000000 // 2 gwei in wei
    },
  },
  etherscan: {
    apiKey: {
      morphTestnet: '',
    },
    customChains: [
      {
        network: 'morphTestnet',
        chainId: 2810,
        urls: {
          apiURL: 'https://explorer-api-holesky.morphl2.io/api?',
          browserURL: 'https://explorer-holesky.morphl2.io/',
        },
      },
    ],
  },
};

module.exports = config;