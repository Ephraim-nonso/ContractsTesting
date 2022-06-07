require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require("dotenv").config()
require("hardhat-gas-reporter");

const mainnetUrl = process.env.MAINNET_URL

module.exports = {
  solidity: {
    version: "0.8.8"
  },
  networks: {
    hardhat: {
      forking: {
        url: mainnetUrl,
        blockNumber: 4043801
      }
    }
  }, 
  gasReporter: {
    currency: 'CHF',
    gasPrice: 21
  }
};
