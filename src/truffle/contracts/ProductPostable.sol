// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ProductFactory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
 
contract ProductPostable is ProductFactory {


    event ProductStatusChange(uint256 productId);

    // Mapping from Product ID to the time when customers can no longer purchase a preorderNFT
    // mapping (uint => uint) public ProductBuyableDate;
    // Mapping from Product ID to the time when customers can either redeem or refund their NFTs
    mapping (uint => uint) ProductRefundableDate;
    // Mapping from address of a store to the number of products they have listed
    mapping (address => uint) storeProductCounter;
    // Mapping from Product ID to mapping from currency address to acceptable boolean
    mapping (uint => mapping (address => bool)) public productCurrencies;
    // Mapping from Store address to list of Store's product IDs
    mapping(address => mapping(uint256 => uint256)) private _storeProducts;
    // Mapping from Store address to Currency address to return if a currency has ever been acceptable for a specific Store or not
    mapping (address => mapping (address => bool)) public acceptableCurrency;
    // Mapping from a Store's address to the number of currencies it accepts
    mapping (address => uint256) private storeCurrencyCount;
    // Mapping from a Store's address to mapping from an index number to currency address
    mapping (address => mapping (uint256 => address)) private indexedStoreCurrency;
    // Mapping from Store address to Currency address to return if a currency is globally active for a specific Store or not
    mapping (address => mapping (address => bool)) public activeCurrency;

    // The default token to be accepted as a currency.
    IERC20 private platformToken;
    // Array of the acceptable currencies
    address[] public acceptableCurrencies;

    function __ProductPostable_init(address _currency) initializer internal {
        __ProductPostable_init_unchained(_currency);
    }

    // Pretty sure I don't need this init function, its only needed in the proxy contract
    /**
     * @dev Initialzes the contract.
     * @param _currency The default currency for which to trade for the item.
     */
    function __ProductPostable_init_unchained(address _currency) initializer internal {
        // currency passed as param is used as default currency token and added to the acceptableCurrencies mapping
        platformToken = IERC20(_currency);
        // acceptableCurrencies[0] will be the default currency that is acceptable for all products by default
        acceptableCurrencies.push(_currency);
        __ProductFactory_init();
    }

    /**
     * @dev Returns an array of all products listed by a specific Store
     */
    //  Note: The client should get all the stores product ID's then call getProducts
     function getStoreProductCount(address store) public view returns(uint) {
        return storeProductCounter[store];
     }

     function getStoreProduct(address store, uint256 index) public view returns(Product memory) {
        uint _productID = _storeProducts[store][index];
        Product memory _product = products[_productID];
        return _product;
     }

    /**
     * @dev Gets the Product ID to corresponds to the provided SKU.
     * @param _sku The SKU tp match to a prduct ID.
     */
    function getProductIdBySKU(address store, string memory _sku) public view returns(uint256) {
        if (getStoreProductCount(store) == 0) {
            return 0;
        }
        for (uint256 i = 0; i <= getStoreProductCount(store); i++) {
            Product memory ref = getStoreProduct(store, i);
            if (keccak256(abi.encodePacked(ref.sku)) == keccak256(abi.encodePacked(_sku))) {
                return i;
            }
        }
        return 0;
    }

     /**
     * @dev Posts a new type of product. 
     * @param _sku The name for the item to trade.
     * @param _wholesalePrice The wholesale price value.
     * @param _retailPrice The retail price value.
     * @param _affiliatePercentage The affiliate percentage.
     * @param _funderRate APY promised to funders
     * @param _refundablePeriod The redeemable period, in weeks.
     * @param redeemable Redeemable status flag
     * @param buyable Buyable status flag
     */
    // TODO: Only the store owner should be able to post a product.
    function postProduct(string memory _sku, uint256 _wholesalePrice, uint256 _retailPrice, uint8 _affiliatePercentage, uint16 _funderRate, uint32 _refundablePeriod, bool redeemable, bool buyable) external {
        // Require that the wholesale and retail prices are above minimums, so we can divide out the affiliate and customers cuts
        require(_wholesalePrice >= 10000, "Wholseale price is below minimum!");
        require(_retailPrice >= 10000, "Retail price is below minimum!");
        require(_retailPrice > _wholesalePrice, "Retail price must be greater than Wholesale price!");
        // Require that the SKU is unique
        require(getProductIdBySKU(_msgSender(), _sku) == 0, "Product with this SKU already exists!");
        // TODO: Define more specifc bounds for the affiliate percentage
        require(_affiliatePercentage < 100, "Affiliate Percentage out of bounds");
        Product memory newProduct;
        newProduct.seller = msg.sender;
        newProduct.sku =  _sku;
        // TODO: I think 18 is what the decimals() function in erc20 returns usually, but not sure about _price * 10 ** 18
        // Note: This should probably be _retailPrice * currencyToken.decimals
        newProduct.wholesalePrice = _wholesalePrice;
        // Note: This should probably be _retailPrice * currencyToken.decimals
        newProduct.retailPrice = _retailPrice;
        // This integer will be converted to a percentage to be shared with affiliates
        newProduct.affiliatePercentage = _affiliatePercentage;
        // This integer will be the APY percentage earned by funders
        newProduct.funderRate = _funderRate;
        // TODO: These next two booleans may need to be set as params passed in by the user instead of defaulting to true
        newProduct.redeemable = redeemable;
        newProduct.buyable = buyable;
        // Using productCounter in an attempt to auto increment ID's
        incrementProductcounter();
        // NOTE: productId 0 will never be assigned, it's reserved as an empty product (if product ID is 0, product doesn't exist)
        products[getProductCounter()] = newProduct;
        // Note: We set the default currency as accpetable. 

        if (!acceptableCurrency[_msgSender()][address(platformToken)]) _addAcceptableCurrency(address(platformToken), _msgSender());
        addCurrencyToProduct(getProductCounter(), address(platformToken));
        // Set this balance of the default currency for this product to 0
        // productBalances[productCounter][address(platformToken)] = 0;
        // Set the buyable expiration date to be _buyablePeriod from now in milliseconds
        // ProductBuyableDate[getProductCounter()] = uint32(block.timestamp + _buyablePeriod);
        // Set the redeemable date to be _redeemablePeriod from now in milliseconds
        ProductRefundableDate[getProductCounter()] = uint256(block.timestamp + (_refundablePeriod * 1 weeks));
        // If this is the Store's first product, make the storeProductCounter 1, else increment the Store's product counter by 1
        // if (storeProductCounter[msg.sender] < 1) {
        //     storeProductCounter[msg.sender] = 1;
        // } else {
            // Note: I have a feeling this won't work for the first product
            storeProductCounter[msg.sender] += 1;
        // }
        // _storeProducts[msg.sender][0] will never exist
        _storeProducts[msg.sender][storeProductCounter[msg.sender]] = getProductCounter();
        // _storeProductIndexByProductID[getProductCounter()] = storeProductCounter[msg.sender];
        emit ProductStatusChange(getProductCounter());
    }

    // TODO: Make this function only callable by the owner (or an admin with permissions)
    // NOTE: I don't think we ever want to change the seller attribute of a product
    /**
     * @dev Updates an existing product.
     * @param productId The Product to update.
     * @param wholesalePrice The updated wholesale price value.
     * @param retailPrice The updated retail price value.
     * @param affiliatePercentage The updated  affiliate percentage.
     * @param funderRate The aPY promised to the funder
     * @param redeemable The updated redeemable value.
     * @param buyable The updated buyable value.
     */
    function updateProduct(
        uint256 productId, 
        uint256 wholesalePrice, 
        uint256 retailPrice, 
        uint8 affiliatePercentage,
        uint16 funderRate,
        bool redeemable, 
        bool buyable
        ) external productExists(productId) {
        // require(_productId > 0 && _productId <= productCounter, "Product ID is out of bounds!");
        // TODO: Define more specifc bounds for the affiliate percentage
        require(affiliatePercentage < 100, "Affiliate Percentage out of bounds");
        require(funderRate < 1000, "Funder APY out of bounds");
        require(wholesalePrice < retailPrice, "Wholesale price must be less than Retail price");
        // Initialize a copy of the existing product with ID _productId
        Product memory updatedProduct = products[productId];
        // Change the copy's values to the provided params
        if (updatedProduct.wholesalePrice != wholesalePrice) updatedProduct.wholesalePrice = wholesalePrice;
        if (updatedProduct.retailPrice != retailPrice) updatedProduct.retailPrice = retailPrice;
        if (updatedProduct.affiliatePercentage != affiliatePercentage) updatedProduct.affiliatePercentage = affiliatePercentage;
        if (updatedProduct.funderRate != funderRate) updatedProduct.funderRate = funderRate;
        if (updatedProduct.redeemable != redeemable) updatedProduct.redeemable = redeemable;
        if (updatedProduct.buyable != buyable) updatedProduct.buyable = buyable;
        // Assign the _productId to the new edited Product
        products[productId] = updatedProduct;
    }

    // TODO: Need to make this only callable by the owner or an admin
    /**
     * @dev Adds a currency to be accepted for a Product. 
     * @param productId The Product to add the currency to.
     * @param currency The currency address to add.
     */
    function addCurrencyToProduct(uint256 productId, address currency) public onlySeller(productId, msg.sender) {
        Product memory _product = products[productId];
        // Require that the currency is in the acceptableCurrencies array
        require(isCurrencyAcceptable(_product.seller, currency), "Currency is not accepted by this Store!");
        productCurrencies[productId][currency] = true;
    }

    /**
     * @dev Returns if a currency is accepted by this store or not. 
     * @param _currency The currency address to check.
     */
    function isCurrencyAcceptable(address _store, address _currency) public view returns(bool) {
        return acceptableCurrency[_store][_currency];
    }

    // TODO: Need to make this only callable by the owner or an admin
    /**
     * @dev Adds a currency to be accepted by the store. 
     * @param _currency The currency address to add.
     */
    function addAcceptableCurrency(address _currency) public {
        _addAcceptableCurrency(_currency, msg.sender);
    }

    function _addAcceptableCurrency(address _currency, address _store) internal {
        // Ensure the currency is not already in the acceptable currencies array
        require(!isCurrencyAcceptable(_store, _currency), "This currnecy is already acceptable!");
        // Make the currency active by default
        activeCurrency[_store][_currency] = true;
        acceptableCurrency[_store][_currency] = true;
        uint256 currencyCount = getStoreCurrencyCount(_store);
        currencyCount++;
        storeCurrencyCount[_store] = currencyCount;
        // Indexed Store currency at position 0 will never exist
        indexedStoreCurrency[_store][currencyCount] = _currency;
        // acceptableCurrencies.push(_currency);
    }

    // TODO: Need to make this only callable by the owner or an admin
    /**
     * @dev Removes a currency from being accepted for a Product. 
     * @param _productId The Product to remove the currency from.
     * @param _currency The currency address to remove.
     */
    function removeCurrencyFromProduct(uint256 _productId, address _currency) public onlySeller(_productId, msg.sender) {
        productCurrencies[_productId][_currency] = false;
    }

    // TODO: Need to make this only callable by the owner or an admin
    /**
     * @dev Makes a currency in the accceptableCurrencies array active. 
     * @param _currency The currency address to activate.
     */ 
    function activateCurrency(address _currency) public {
        require(isCurrencyAcceptable(msg.sender, _currency), "Currency is not in the acceptableCurrencies array!");
        activeCurrency[msg.sender][_currency] = true;
    }

    // TODO: Need to make this only callable by the owner or an admin 
    /**
     * @dev Makes a currency in the accceptableCurrencies array inactive. 
     * @param _currency The currency address to deactivate.
     */ 
    function deactivateCurrency(address _currency) public {
        require(isCurrencyAcceptable(msg.sender, _currency), "Currency is not in the acceptableCurrencies array!");
        activeCurrency[msg.sender][_currency] = false;
    }

    function isCurrencyActive(address _store, address _currency) public view returns(bool) {
        return activeCurrency[_store][_currency];
    }

    /**
     * @dev Retuns a specific product
     * @param _id The ID of the product to return
     */
     function getProduct(uint _id) public view returns(Product memory _product) {
        return products[_id];
     }

     /**
     * @dev Retuns a list of products
     * @param _ids The ID of the products to return
     */
     function getProducts(uint[] memory _ids) public view returns(Product[] memory) {
        Product[] memory out = new Product[](_ids.length);
        for (uint i = 0; i < _ids.length; i++) {
            Product memory _product = getProduct(_ids[i]);
            out[i] = _product;
        }
        return out;
     }

    /**
     * @dev Returns an array of acceptable currency's addresses for the Product. 
     * @param _productId The Product ID to get acceptableCurrencies for.
     */ 
    function getProductCurrencies(uint256 _productId) public view returns(address[] memory) {
        Product memory _product = products[_productId];
        uint productCurrenciesLength = 0;
        for (uint256 i = 0; i <= getStoreCurrencyCount(_product.seller); i++) {
            if (isCurrencyActive(_product.seller, getStoreCurrencyByIndex(_product.seller, i))) {
                // productCurrenciesLength++;
                if (productCurrencies[_productId][getStoreCurrencyByIndex(_product.seller, i)]) {
                    productCurrenciesLength++;
                }
            }
        }
        address[] memory currencies = new address[](productCurrenciesLength);
        uint256 j = 0;
        for (uint256 i = 0; i <= productCurrenciesLength; i++) {
            if (isCurrencyActive(_product.seller, getStoreCurrencyByIndex(_product.seller, i))) {
                if (productCurrencies[_productId][getStoreCurrencyByIndex(_product.seller, i)]) {
                    currencies[j] = acceptableCurrencies[i];
                    j++;
                }
            }
        }
        return currencies;
    }

    function isCurrencyAcceptableForProduct(uint256 _productId, address _currency) public view returns(bool) {
        bool _acceptable = false;
        if (productCurrencies[_productId][_currency]) {
            _acceptable = true;
        }
        return _acceptable;
    }

    function isProductRefundable(uint productID) public view returns(bool) {
        if (block.timestamp >= ProductRefundableDate[productID]) {
            return true;
        }
        return false;
    }

    function getStoreCurrencyCount(address store) public view returns(uint256) {
        return storeCurrencyCount[store];
     }

     /**
     * @dev Retuns the address at acceptableCurrencies[_index].
     * @param _index The index of the address in the array.
     */
    function getStoreCurrencyByIndex(address _store, uint256 _index) public view returns(address) {
        require(_index < getStoreCurrencyCount(_store), "Index is out of bounds");
        return indexedStoreCurrency[_store][_index];
    }

    /**
     * @dev Returns a copy of the acceptableCurrencies array. 
     */ 
    function getCurrencies() public view returns(address[] memory) {
        // address[] memory currencies = new address[](acceptableCurrencies.length);
        // currencies = acceptableCurrencies;
        // return currencies;
        return acceptableCurrencies;
    }

}