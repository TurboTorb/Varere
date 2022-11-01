// migrations/5_deploy_stabelcoin_proxy.js
const StablecoinProxy = artifacts.require('StablecoinProxy');
 
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const myAddress = '0xD7a3D35d5eCdB855F3C0981967f5f30FC6846b7A';
 
module.exports = async function (deployer) {
  // await deployProxy(StablecoinProxy, [myAddress], { deployer });
};