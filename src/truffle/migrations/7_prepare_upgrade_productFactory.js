// migrations/4_prepare_upgrade_boxv2.js
const ProductFactoryProxy = artifacts.require('ProductFactoryProxy');
const ProductFactory = artifacts.require('ProductFactory');
 
const { prepareUpgrade } = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer) {
  const productFactoryProxy = await ProductFactoryProxy.deployed();
  // const newInstance = await prepareUpgrade(productFactoryProxy.address, ProductFactory, { deployer });
  // console.log("Upgraded", newInstance.address);
};