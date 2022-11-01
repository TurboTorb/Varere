// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
 
contract Stablecoin is ERC20Upgradeable {

    address deployer;

    function __Stablecoin_init(address _to) initializer public {
        __ERC20_init("USDC", "USDC");
        // Mint ourselves 10,000 USDC for testing
        // NOTE: By default ERC20 tokens have 18 decimal places, each unit here is denominated in the smallest decimal place.
        _mint(_to, 10000000000000000000000);
        deployer = _to;
    }

    function getDeployer() public view returns (address) {
        return deployer;
    }

    function newMint(address _to, uint256 amount) public returns(uint256) {
        _mint(_to, amount);
        return balanceOf(_to);
    }
    
}