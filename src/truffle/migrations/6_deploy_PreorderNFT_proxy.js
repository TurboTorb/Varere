// migrations/4_deploy_PreorderNFT.js
const PreorderNFTProxy = artifacts.require('PreorderNFTProxy');
const StablecoinProxy = artifacts.require('StablecoinProxy');
const ProductFactoryProxy = artifacts.require('ProductFactoryProxy');
 
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const myAddress = '0xD7a3D35d5eCdB855F3C0981967f5f30FC6846b7A';
 
module.exports = async function (deployer) {
  const stablecoinProxy = await StablecoinProxy.deployed();
  const productFactoryProxy = await ProductFactoryProxy.deployed();
  const platformTokenAddress = stablecoinProxy.address;
  const productAddress = productFactoryProxy.address;
  // await deployProxy(PreorderNFTProxy, [productAddress, platformTokenAddress], { deployer });
};