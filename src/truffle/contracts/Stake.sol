// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./StakingNFT.sol";
// import "./LockedStaking.sol";

//Note: Any contract that wants to receive a newly minted NFT will need to support safeTransfers. See: "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721ReceiverUpgradeable.sol"
 
contract Stake is StakingNFT {

    function __Stake_init() initializer public {
        __Stake_init_unchained();
    }

    function __Stake_init_unchained() initializer public {
        __StakingNFT_init_unchained();
    }

}