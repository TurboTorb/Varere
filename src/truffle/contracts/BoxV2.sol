// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Stake.sol";
 
contract BoxV2 is Stake {

    //New stuff goes here
    function initializeBoxV2() initializer public {
        __Stake_init();
    }

}