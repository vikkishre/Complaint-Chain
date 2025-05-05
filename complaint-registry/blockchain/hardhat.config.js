require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../backend/.env" });  // Adjust the path to where your .env file is located

module.exports = {
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1337,  // Add the network ID here
    }
  },
  solidity: "0.8.28",
};
