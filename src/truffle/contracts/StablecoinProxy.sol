// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Stablecoin.sol";
 
contract StablecoinProxy is Stablecoin {

    function initialize(address to) initializer public {
        __Stablecoin_init(to);
    }
    
}