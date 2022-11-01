// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/finance/PaymentSplitterUpgradeable.sol";
 
contract Splitter is PaymentSplitterUpgradeable {

    function __Splitter_init(address[] memory _payees, uint256[] memory _shares) initializer public {
        __PaymentSplitter_init_unchained(_payees, _shares);
    }

    function __Splitter_init_unchained(address[] memory _payees, uint256[] memory _shares) initializer public {
        __Splitter_init(_payees, _shares);
    }
    
}