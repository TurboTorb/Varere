// test/Box.proxy.test.js
// Load dependencies
const { expect } = require('chai');
const { deployProxy, upgradeProxy} = require('@openzeppelin/truffle-upgrades');
 
// Load compiled artifacts
const StablecoinProxy = artifacts.require('StablecoinProxy');
const Stablecoin = artifacts.require('Stablecoin');
const myAddress = '0xD7a3D35d5eCdB855F3C0981967f5f30FC6846b7A';
 
// Start test block
contract('Stablecoin (proxy)', function (accounts) {
  let me = accounts[0];
  let _contract = null;
 
  beforeEach(async function () {
    // Deploy a new Box contract for each test
    this.stablecoinProxy = await deployProxy(StablecoinProxy, [myAddress]);
    this.stablecoin = await upgradeProxy(this.stablecoinProxy.address, Stablecoin);
  });
 
  // Test case
  it('gets the deployers address', async function () {
    // Check balance of me
    const deployer = await this.stablecoin.getDeployer();
    // Test if the deployer is me
    assert.equal(deployer, me, 'The owner should be me');
  });

  it('checks if current balance is greater than 0', async function () {
    // Check balance of me
    const balance = await this.stablecoin.balanceOf(me);
    // Test if the balance is greater than 0
    expect(parseInt(balance)).to.gt(0);
  });

  it('checks if current balance is 10,000,000,000,000,000,000,000 (10,000 USDC since it has 18 decimal places)', async function () {
    // Check balance of me
    const balance = await this.stablecoin.balanceOf(me);
    // Test if the balance is greater than 0
    expect(parseInt(balance)).to.equal(10000000000000000000000);
  });
});