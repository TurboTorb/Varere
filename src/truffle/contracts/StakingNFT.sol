// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

//Note: Any contract that wants to receive a newly minted NFT will need to support safeTransfers. See: "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721ReceiverUpgradeable.sol"
 
contract StakingNFT is ERC721Upgradeable {

    using SafeMathUpgradeable for uint256;

    // An incrementing integer for generating unique token IDs
    uint256 public nextId;

    function __StakingNFT_init() initializer public {
        __StakingNFT_init_unchained();
    }

    function __StakingNFT_init_unchained() initializer public {
        __ERC721_init_unchained("Box", "BX");
    }

    function _newMint(address payee) internal {
        // We use add() instead of ++ to increment the nextId, this way we never overflow the uint256
        uint256 thisId = nextId;
        nextId.add(1);
        uint256 tokenId = thisId;
        _safeMint(payee, tokenId);
    }   
    
}