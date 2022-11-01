// migrations/4_deploy_PreorderNFT.js
const ProductFactoryProxy = artifacts.require('ProductFactoryProxy');
const StablecoinProxy = artifacts.require('StablecoinProxy');
 
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const myAddress = '0xD7a3D35d5eCdB855F3C0981967f5f30FC6846b7A';
 
module.exports = async function (deployer) {
  const stablecoinProxy = await StablecoinProxy.deployed();
  const mockUSDC = stablecoinProxy.address;
  await deployProxy(ProductFactoryProxy, [mockUSDC], { deployer });
};