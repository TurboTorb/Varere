// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Stake.sol";
 
contract Box is Stake {

    function initializeBox() initializer public {
        __Stake_init();
    }
    
}