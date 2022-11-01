// migrations/2_deploy_box.js
const Staking = artifacts.require('Staking');
 
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer) {
  // await deployProxy(Staking, { deployer });
};
