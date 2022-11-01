// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

//Note: Any contract that wants to receive a newly minted NFT will need to support safeTransfers. See: "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721ReceiverUpgradeable.sol"
 
contract ProductFactory is OwnableUpgradeable {

    struct Product {
        // Address of the seller (usually the store) offering the product.
        address seller;
        // Name of the specific Product.
        string sku;
        // Retail Price of the product. Seller should be able to update this for sales and stuff.
        uint256 retailPrice;
        // Wholesale Price of the product. Stakers can stake this amount to fund the production of a single product.
        uint256 wholesalePrice;
        // Percentage to be shared with Affiliates.
        uint8 affiliatePercentage;
        // Rate of APY for funders
        uint16 funderRate;
        // Index of the product
        // uint256 index;
        // Redeemable Status
        bool redeemable;
        // Buyable status
        bool buyable;
    }

    // Mapping from Product ID to the Product.
    mapping (uint => Product) public products;

    // The total amount of products that have been minted
    uint256 private productCounter;

     // Preorders are only redeemable when true
    modifier onlySeller(uint _productId, address _seller) {
        Product memory product = products[_productId];
        require(product.seller == _seller, "Only the Store selling this product can call this function!");
        _;
    }

    modifier productExists(uint _productId) {
        require(_productId != 0 && _productId <= getProductCounter(), "Product does not exist!");
        _;
    }

    function __ProductFactory_init() initializer internal {
        __ProductFactory_init_unchained();
    }

    // Pretty sure I don't need this init function, its only needed in the proxy contract
    /**
     * @dev Initialzes the contract.
     */
    function __ProductFactory_init_unchained() initializer internal {
        productCounter = 0;
        __Ownable_init();
    }

    function incrementProductcounter() internal returns(bool) {
        uint256 newCounter = getProductCounter();
        newCounter++;
        productCounter = newCounter;
        return true;
    }

    function getProductCounter() public view returns(uint256) {
        return productCounter;
    }

}