// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts-upgradeable/utils/escrow/ConditionalEscrowUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

 // Note  that block.timestamp is used instead of "now" because the latter is deprecated.
contract Staking is ERC20Upgradeable {

    // uint private value;
    // The user will be able to set their own lock time between maybe 1 week and 2 years
    // uint32 defaultLockTime;

    // function __LockedStaking_init() initializer public {
    //     __LockedStaking_init_unchained();
    // }

    function __Staking_init() internal onlyInitializing {
        __Staking_init_unchained();
    }


    function __Staking_init_unchained() internal onlyInitializing {
        __ERC20_init_unchained("VeToken", "VeTKN");
    }

    // function __LockedStaking_init_unchained() public {
    //     // TODO: THis doesn't work, defaultLockTime is not set.
    //     defaultLockTime = 2 weeks;
    //     __ConditionalEscrow_init_unchained();
    // }

    // The time this payee will be able to withdraw their shares
    // mapping(address => uint32) private _lockExpTime;
    // The time this payee has chosen to lock up their funds for
    // mapping(address => uint32) private _customLockTime;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Check if the payee is allowed to withdraw
    // function withdrawalAllowed(address payee) public view override(ConditionalEscrowUpgradeable) returns (bool) {
    //     require(_lockExpTime[payee] < uint32(block.timestamp), "Stake: Lock Time has not expired");
    //     return true;
    // }

    // Start a new lock period for the given payee, starting right now.
    // function _setLockExpTime(address payee) internal {
    //     _lockExpTime[payee] = uint32(block.timestamp + _customLockTime[payee]);
    // }

    // function _setCustomLockTime(address payee, uint32 customLockTime) internal {
    //     require(customLockTime >= 1 seconds, "Stake: custom lock time must be greater than 6 days");
    //     require(customLockTime <= 104 weeks, "Stake: custom lock time must be less than 2 years");
    //     _customLockTime[payee] = customLockTime;
    // }

    // function deposit(address payee) public payable virtual override {
        // if (depositsOf(payee) <= 0) {
        //     // If this is the first deposit, set the payee's cutom lock exp time to the default
        //     // _setCustomLockTime(payee, defaultLockTime);
        //     // TODO: Get defaultLockTime from the contract
        //     _setCustomLockTime(payee, 2 minutes);
        // }
        // super.deposit(payee);
        // _setLockExpTime(payee);
        // TODO: call _newMint(payee) in the StakingNFT contract
    // }

    // function getLockExpTime(address payee) public view returns (uint32) {
    //     return _lockExpTime[payee];
    // }

    // Stores a new value in the contract
    // function store(uint256 newValue) public {
    //     value = newValue;
    //     emit ValueChanged(newValue);
    // }
    
    // // Reads the last stored value
    // function retrieve() public view returns (uint256) {
    //     return value;
    // }
    
    // // Increments the stored value by 1
    // function increment() public {
    //     value = value + 1;
    //     emit ValueChanged(value);
    // }
}