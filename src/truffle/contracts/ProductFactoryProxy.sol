// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ProductPostable.sol";
 
contract ProductFactoryProxy is ProductPostable {

function initialize(address _currency) initializer public {
        __ProductPostable_init(_currency);
    }

}