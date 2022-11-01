// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./PreorderNFT.sol";
import "./ProductFactory.sol";

//Note: Any contract that wants to receive a newly minted NFT will need to support safeTransfers. See: "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721ReceiverUpgradeable.sol"
 
contract PreorderNFTProxy is PreorderNFT {

function initialize(address _productAddress, address _currency) initializer public {
        __PreorderNFT_init(_productAddress, _currency);
    }

}