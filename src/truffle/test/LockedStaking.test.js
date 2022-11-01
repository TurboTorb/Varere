// // Load dependencies
// const { expect } = require('chai');
 
// // Load compiled artifacts
// const Staking = artifacts.require('Staking');
// const userAddress = "0xD7a3D35d5eCdB855F3C0981967f5f30FC6846b7A";

 
// // Start test block
// contract('Staking', function (accounts) {
//     let currentOwner = null;
//     let _contract = null;
//     let me = accounts[0];
//     let other = accounts[1];
//     beforeEach(async function () {
//         // Deploy a new Staking contract for each test
//         this.staking = await Staking.new();
//         _contract = await Staking.deployed();
//         // currentOwner = await _contract.owner();
//         console.log("currentOwner: " + currentOwner);
//         console.log("me: " + me);
//         console.log("other: " + other);
//   });
 
//   // Test case
//   it('retrieve returns a value previously deposited', async function () {
//     // Deposit a value
//     await _contract.deposit(me, {from: me, value: 3});
//     const deposits = await _contract.depositsOf(me);
//     // Test if the depositing works as intended
//     expect(parseInt(deposits)).to.equal(3);
//     assert.equal(parseInt(deposits), 3, 'deposit should be 3');
//   });
// });