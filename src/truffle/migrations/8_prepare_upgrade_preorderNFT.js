// migrations/4_prepare_upgrade_boxv2.js
const PreorderNFTProxy = artifacts.require('PreorderNFTProxy');
const PreorderNFT = artifacts.require('PreorderNFT');
 
const { prepareUpgrade } = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer) {
  const preorderNFTProxy = await PreorderNFTProxy.deployed();
  // const newInstance = await prepareUpgrade(preorderNFTProxy.address, PreorderNFT, { deployer });
  // console.log("Upgraded", newInstance.address);
};