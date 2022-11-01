// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "./ProductFactory.sol";

//Note: Any contract that wants to receive a newly minted NFT will need to support safeTransfers. See: "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721ReceiverUpgradeable.sol"
interface IProduct {

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
        uint8 affiliatePrecentage;
        // Rate of APY for funders
        uint16 funderRate;
        // Index of the product
        // uint256 index;
        // Redeemable Status
        bool redeemable;
        // Buyable status
        bool buyable;
    }

    function getProductCounter() external view returns(uint256);

    function getProduct(uint id) external view returns(Product memory);

    function isCurrencyActive(address store, address currency) external view returns(bool);

    function isCurrencyAcceptable(address store, address currency) external view returns(bool);

    function getCurrenciesLength() external view returns(uint256);

    function getAcceptableCurrencyByIndex(uint256 index) external view returns(address);

    function isCurrencyAcceptableForProduct(uint256 productID, address currency) external view returns(bool);

    function isProductRefundable(uint productID) external view returns(bool);

}

contract PreorderNFT is ERC721EnumerableUpgradeable, OwnableUpgradeable {

    address productAddress;

    // The default token to be accepted as a currency.
    IERC20 private platformToken;
    
    // event PreorderRedeemed(uint256 nftId);
    // event PreorderRefunded(uint256 nftId);

    // Mapping from NFT Token ID to Product Item ID
    mapping (uint => uint) private NFTtoProduct;
    // Mapping from NFT Token ID to its Redeemable status
    mapping (uint => bool) public isNFTUseable;
    // Mapping from NFT Token ID to its Funded status
    mapping (uint => bool) public isNFTFunded;
    // Mapping from NFT Token ID to the amount paid for the NFT when it was minted
    // TODO: Might need to aslo map in here the address of the currency used to pay
    mapping (uint => uint) public NFTPricePaid;
    // Mapping from NFT Token ID to the address that funded it
    mapping (uint => address) public NFTfunder;
    // Mapping from the NFT Token ID to the amount the Funder paid to fund it
    mapping (uint => uint) private funderAmountPaid;
    // Mappin from the NFT Token Id to the APY earned by the funder
    mapping (uint => uint16) private funderRate;
    // Mapping from a wallet address to a boolean, indicating if a wallet address is an affiliate
    mapping (address => bool) private isAffiliate;
    // Mapping from the Affiliates discount code to their wallet address
    mapping (string => address) private codeToAffiliate;
    // Mapping from the Affiliates discount code to their wallet address
    mapping (address => string) private affiliateToCode;
    // Mapping from NFT Token ID to the affiliate's wallet address
    mapping (uint => address) private NFTaffiliate;
    // Mapping from the NFT Token ID to the amount due to the Store
    mapping (uint => uint) private NFTstoreAmountDue;
    // Mapping from the NFT Token ID to the amount due to the Affiliate
    mapping (uint => uint) private NFTaffiliateAmountDue;
    // Mapping from the Affiliate's wallet address to the percentage they share with the customer.
    // Note: We store this as an integer and convert to a percentage for the math. ie. a value of 20 will be 20% or .2 
    mapping (address => uint8) private affiliateSharedPercentage;
    // Mapping from the NFT Token ID to the address of the currency used to buy it
    mapping (uint => address) private boughtWith;
    // Mapping from the NFT Token ID to the address of the currency used to fund it
    mapping (uint => address) private fundedWith;
    // Mapping from Product ID to the currencies balances for that product
    mapping (uint => mapping (address => uint)) public productBalances;
    // Mapping from the Product ID to the number of units sold
    mapping (uint => uint64) internal unitsSold;
    // Mapping from the Product ID to the number of units redeemed by the customer
    mapping (uint => uint64) internal unitsRedeemed;
    // Mapping from the Product ID to the number of units refunded to the customer
    mapping (uint => uint64) internal unitsRefunded;
    // Mapping from the Product ID to the number of units shipped to and received by the customer
    mapping (uint => uint64) internal unitsReceived;
    // Mapping from the Store's wallet address to the number of units sold
    mapping (address => uint64) internal storeUnitsSold;
    // Mapping from the Store's wallet address to the number of units redeemed by the customer
    mapping (address => uint64) internal storeUnitsRedeemed;
    // Mapping from the Store's wallet address to the number of units refunded to the customer
    mapping (address => uint64) internal storeUnitsRefunded;
    // Mapping from the Store's wallet address to the number of units shipped to and received by the customer
    mapping (address => uint64) internal storeUnitsReceived;
    // Mapping from Product ID to a list of orphaned Funders
    // mapping (uint => mapping (uint => address)) internal orphanedFunderAddress;
    // Mapping from ProductID to index to currency the orphaned funder originally funded with
    mapping (uint => mapping (uint => uint)) internal orphanedFunderNFTid;
    // Mapping from NFT Token ID to if boolean flag reprenting if it was orphaned or not
    mapping (uint => bool) internal NFTwasOrphaned;
    // Mapping from Product ID to the length of that Product's orphaned Funders list
    mapping (uint => uint) internal orphanedFundersCount;
    // Mapping from NFT Token ID to the number of seconds since the Unix time origin as a uint
    mapping (uint => uint) internal fundedTimestamp;

    struct FunderPayout {
        // Funders withdrawal allowance
        uint funderAllowance;
        // This is the number of seconds since the Funder funded the product
        uint secondsSinceFunding;
        // The remainder is the number seconds left over after converting from seconds to days
        uint daysSinceFundingRemainder;
        // The number of full days since the Funder funded the product
        uint daysSinceFunding;
        // The amount the funder would be paid if 1 full year had past since the funded the product
        uint annualYield;
        // The remainder left when dividing annualYield by 365 to get the daily yield
        // Note: Loss of up to max 364 wei should be negligable for the Funder
        uint dailyYieldRemainder;
        // The amount the funder accumulates each day since they funded the product
        uint dailyYield;
        // The total yield the Funder has earned so far
        uint payoutYield;
        // The max amount that the Funder's amount due can be
        uint maxAmountDue;
    }

     // Modifier to check token allowance
    // modifier checkAllowance(uint _amount) {
    //     require(currencyToken.allowance(msg.sender, address(this)) >= _amount, "Error not enough allowance");
    //     _;
    // }

    modifier productExists(uint _productId) {
        require(_productId != 0 && _productId <= IProduct(productAddress).getProductCounter(), "Product does not exist!");
        _;
    }

    // Preorders are only redeemable when true
    modifier ifRedeemable(uint _id) {
        uint _productId = getProductByNFT(_id);
        IProduct.Product memory _product = IProduct(productAddress).getProduct(_productId);
        require(_product.redeemable, "Product is not Redeemable");
        _;
    }

    // Only the NFT's owner can call this
    modifier onlyNFTowner(uint _id, address _owner) {
        require(ownerOf(_id) == _owner, "Only the NFT's owner can call this function");
        _;
    }

    modifier onlySeller(uint _productId, address _seller) {
        IProduct.Product memory _product = IProduct(productAddress).getProduct(_productId);
        require(_product.seller == _seller, "Only the Store selling this product can call this function!");
        _;
    }

    // modifier currencyCheck(address _currency) {
    //     require(IProduct.isCurrencyActive(_product.seller, _currency), "Currency is not active!");
    //     require(IProduct.isCurrencyAcceptableForProduct(productId, _currency), "Currency is not acceptable for this product!");
    //     _;
    // }

    function __PreorderNFT_init(address _productAddress, address _currency) initializer public {
        __PreorderNFT_init_unchained(_productAddress, _currency);
    }

    // Pretty sure I don't need this init function, its only needed in the proxy contract
    /**
     * @dev Initialzes the contract.
     * @param _productAddress The default currency for which to trade for the item.
     */
    function __PreorderNFT_init_unchained(address _productAddress, address _currency) initializer public {

        // currency passed as param is used as default currency token and added to the acceptableCurrencies mapping
        productAddress = _productAddress;
        platformToken = IERC20(_currency);
        __ERC721_init("PreOrder", "PRE");
    }

    // function getProductCount() public view returns (uint256) {
    //     return productCounter;
    // }

    //  Note: Just call tokenOfOwnerByIndex(owner, index) for each number less than the balanceOf(owner)
    // function getNFTsByOwner(address owner) public view returns(uint256[] memory) {
    //     require(balanceOf(owner) > 0, "Caller does not own any of our NFTs!");
    //     uint256[] memory tokenIds = new uint256[](balanceOf(owner));
    //     // uint256[] memory tokenIds = new uint256[](ownedAmount + 1);
    //     // j will be the index for the array
    //     uint256 j = 0;
    //     for (uint256 i = 1; i <= totalSupply(); i++) {
    //         // i will be used as the NFT Token ID
    //         if (ownerOf(i) == owner) {
    //             tokenIds[j] = i;
    //             j++;
    //         }
    //     }
    //     return tokenIds;
    // }

    // You can send in the user's address and the product SKU they want to redeem an NFT for.
    // We loop through all thue user's owned NFTs and see if any match that products SKU
    
    //  Note: This can all be checked client side
    // function checkNFTOwnershipBySku(address owner, string memory sku) public view returns(uint256) {
    //     uint256 productId = getProductIdBySKU(sku);
    //     require(productId > 0 && productId <= productCounter, "Product with this SKU does not exist!");
    //     uint256[] memory list = getNFTsByOwner(owner);
    //     for (uint256 i = 0; i < list.length; i++) {
    //         // TODO: This will return the first match, though the owner may own multiple NFT's for the same Product ID
    //         if (keccak256(abi.encodePacked(products[NFTtoProduct[list[i]]].sku)) == keccak256(abi.encodePacked(products[productId].sku))) {
    //             return list[i];
    //         }
    //     }
    //     return 0;
    // }

    // Checks if an NFT with this ID exixsts already
    // function preorderExists(uint id) public view returns(bool) {
    //     if (_exists(id)) {
    //         return true;
    //     }
    //     return false;
    // }

    function getQuote(address currency, uint productId, address affiliate) public view productExists(productId) returns(uint) {
        if (!isAffiliate[affiliate]) {
            affiliate = address(0);
        }
        // Require this product actually exists
        // require(productId <= productCounter, "Product does not exist, ID out of bounds");
        // Require currency is acceptable and active
        require(IProduct(productAddress).isCurrencyAcceptableForProduct(productId, currency), "Currency is not acceptable for this product!");
        IProduct.Product memory _product = IProduct(productAddress).getProduct(productId);
        require(IProduct(productAddress).isCurrencyActive(_product.seller, currency), "Currency is not active!");
        // require(isCurrencyAcceptable(product.seller, currency), "Currency is not acceptable!");
        // require(productCurrencies[productId][currency], "Currency is not acceptable for this product!");
        uint amountDue = _product.retailPrice;
        if (affiliate != address(0)) {
            uint affiliateShare = (amountDue * _product.affiliatePrecentage) / 100;
            uint customerDiscount = (affiliateShare * affiliateSharedPercentage[affiliate]) / 100;
            amountDue -= customerDiscount;
        }
        return amountDue;
    }

    function quoteCart(address currency, uint[] memory productIds, address affiliate) public view returns(uint) {
        if (!isAffiliate[affiliate]) {
            affiliate = address(0);
        }
        uint total = 0;
        for (uint i = 0; i < productIds.length; i++) {
            total += getQuote(currency, productIds[i], affiliate);
        }
        return total;
    }

    /**
     * @dev Caller gives this contract the amount of currency token required to pay for this product. 
     * @dev A new redeemable NFT is then minted for the caller
     * @param currency The currency that will be used to buy the NFT.
     * @param productId The product the NFT will represent.
     */ 
    //  NOTE: The front end needs to approve the transfer for whatever currency is going to be used before preordering
    function purchasePreorder(address currency, uint productId, address affiliate) public {
        address to = msg.sender;
        if (!isAffiliate[affiliate]) {
            affiliate = address(0);
        }
        uint amountDue = getQuote(currency, productId, affiliate);
        IProduct.Product memory _product = IProduct(productAddress).getProduct(productId);
        // Require the product is buyable
        require(_product.buyable, "Product is not buyable");
        require(IERC20(currency).transferFrom(to, address(this), amountDue), "Transaction failed");
        // Add the price in the paid currency to the product's balance for that currency
        // TODO: Need to set a common denominator function for all currencies that looks up the currencies current value through maybe Uniswap quotes
        productBalances[productId][currency] += amountDue;
        // NOTE: NFT with Token ID 0 will never be assigned (if NFT ID is 0, NFT doesn't exist)
        uint _id = totalSupply() + 1;
        boughtWith[_id] = currency;
        NFTPricePaid[_id] = amountDue;
        NFTtoProduct[_id] = productId;
        isNFTUseable[_id] = true;
        isNFTFunded[_id] = false;
        unitsSold[productId] += 1;
        storeUnitsSold[_product.seller] += 1;
        if (affiliate != address(0)) {
            NFTaffiliate[_id] = affiliate;
            uint affiliateTotal = (_product.retailPrice * _product.affiliatePrecentage) / 100;
            NFTaffiliateAmountDue[_id] = affiliateTotal - ((affiliateTotal * affiliateSharedPercentage[affiliate]) / 100);
            NFTstoreAmountDue[_id] = (_product.retailPrice - affiliateTotal);
        } else {
            NFTstoreAmountDue[_id] = amountDue;
        }
        _safeMint(to, _id);
        if (getOrphanedFundersCount(productId) > 0) {
            uint _orphanedNFTid = getOrphanedFunderNFTidByIndex(productId, 0);
            _fundPreorder(fundedWith[_orphanedNFTid], productId, NFTfunder[_orphanedNFTid], _orphanedNFTid);
        }
        // If this prodcut is instantlly redeemable, redeem it automatically
        if (_product.redeemable) {
            redeemPreorder(_id);
        }
    }

    /**
     * @dev Caller gives this contract the amount of currency token required to pay for this product. 
     * @dev A new redeemable NFT is then minted for the caller
     * @param currency The currency that will be used to buy the NFT.
     * @param productIds The product the NFT will represent.
     * @param affiliate The affiliate used (address(0) if no affiliate)
     */ 
    //  NOTE: The front end needs to approve the transfer for whatever currency is going to be used before preordering
    function checkoutCart(address currency, uint[] memory productIds, address affiliate) external {
        for (uint i = 0; i < productIds.length; i++) {
            purchasePreorder(currency, productIds[i], affiliate);
        }
    }

    /**
     * @dev Redeems the NFT for the product it represents
     * @param NFTid The NFT to redeem.
     */ 
    function redeemPreorder(uint NFTid) public ifRedeemable(NFTid) onlyNFTowner(NFTid, msg.sender) {
        // Require that the NFT with Token ID NFTid actually exists
        require(_exists(NFTid), "NFT doesn't exist!");
        // Require that msg.sender is the owner of the NFT with Token ID NFTid
        // require(ownerOf(NFTid) == msg.sender, "Only the NFT's owner can redeem it for a product");
        uint _productId = getProductByNFT(NFTid);
        IProduct.Product memory _product = IProduct(productAddress).getProduct(_productId);
        // Require that the NFT is redeemable
        require(isNFTUseable[NFTid], "This NFT is not redeemable, it may have already been redeemed or refunded!");
        // Require that this contract has a balance for this product in a currency to pay to the store
        require(productBalances[_productId][boughtWith[_productId]] >= NFTPricePaid[NFTid], "This contract does not have a sufficient balance to approve the payout");
        // Set redeemable status to false so it cannot be redeemed or refunded again
        isNFTUseable[NFTid] = false;
        unitsRedeemed[_productId] += 1;
        address storeAddress = _product.seller;
        storeUnitsRedeemed[storeAddress] += 1;

        if (NFTaffiliateAmountDue[NFTid] > 0) {
            address affiliateAddress = getNFTaffiliate(NFTid);
            // Approved amount for Affiliate to withdraw is increased here
            uint affiliateAllowance = IERC20(boughtWith[NFTid]).allowance(address(this), NFTaffiliate[NFTid]);
            affiliateAllowance += NFTaffiliateAmountDue[NFTid];
            require(IERC20(boughtWith[NFTid]).approve(affiliateAddress, affiliateAllowance), "Approval for Affiliate to withdraw failed!");
            // IERC20(boughtWith[NFTid]).increaseAllowance(_product.seller, storeAmountDue);
            // IERC20(boughtWith[NFTid]).increaseAllowance(affiliateAddress, affiliateAmountDue);
        }

        uint funderAmountDue = 0;
        // If this product was funded, pay the Funder his share
        if (isNFTFunded[NFTid]) {
            FunderPayout memory _payout;
            _payout.funderAllowance = IERC20(fundedWith[NFTid]).allowance(address(this), NFTfunder[NFTid]);
            // This is the amount the Funder initially funded this product with
            funderAmountDue = funderAmountPaid[NFTid];
            _payout.secondsSinceFunding = block.timestamp - fundedTimestamp[NFTid];
            _payout.daysSinceFundingRemainder = _payout.secondsSinceFunding % 1 days;
            // We get rid of the remainder here so we can cleanly convert seconds to days
            _payout.secondsSinceFunding -= _payout.daysSinceFundingRemainder;
            // The number of full days since the Funder funded the product
            _payout.daysSinceFunding = _payout.secondsSinceFunding / 1 days;
            // The amount the funder would be paid if 1 full year had past since the funded the product
            _payout.annualYield = (funderAmountDue * funderRate[NFTid]) / 100;
            _payout.dailyYieldRemainder = _payout.annualYield % 365;
            // We get rid of the remainder here so we can cleanly convert annual yield to daily yield
            _payout.annualYield -= _payout.dailyYieldRemainder;
            _payout.dailyYield = _payout.annualYield / 365;
            _payout.payoutYield = _payout.dailyYield * _payout.daysSinceFunding;
            // The Funder's amount due is the amount they initially funded with + the yield earned so far
            funderAmountDue += _payout.payoutYield;
            _payout.maxAmountDue = NFTstoreAmountDue[NFTid];
            // If the Funder's amount due is greater tha nthe max amount due, set it to equal the max amount due
            if (funderAmountDue > _payout.maxAmountDue) funderAmountDue = _payout.maxAmountDue;
            // Add the Funder's amount due to their withdrawable allowance
            _payout.funderAllowance += funderAmountDue;
            // Approve the new allowance
            require(IERC20(fundedWith[NFTid]).approve(NFTfunder[NFTid], _payout.funderAllowance), "Approval for Funder to withdraw failed!");
        }

        // Approved amount for Store to withdraw is increased here
        // TODO: Adding funder will break this
        // If Store is due an amount greater than 0, add that amount to their allowance to withdraw
        if ((NFTstoreAmountDue[NFTid] - funderAmountDue) > 0) {
            uint storeAllowance = IERC20(boughtWith[NFTid]).allowance(address(this), storeAddress);
            storeAllowance += (NFTstoreAmountDue[NFTid] - funderAmountDue);
            require(IERC20(boughtWith[NFTid]).approve(storeAddress, storeAllowance), "Approval for Store to withdraw failed!");
        }
        // require(currencyToken.approve(affiliateAddress, affiliateAllowance), "Approval for future withdrawal failed!");
        // require(currencyToken.allowance(address(this), affiliateAddress) >= affiliateAmountDue, "Actual allowance is less than our amount due value!");
        // require(IERC20(acceptableCurrencies[0]).approve(storeAddress, newApprovalAmount), "Approval for future withdrawal failed!");
        // require(IERC20(acceptableCurrencies[0]).allowance(address(this), storeAddress) >= newApprovalAmount, "Actual allowance is less than our allowance value!");

        // require(currencyToken.approve(storeAddress, storeAllowance), "Approval for future withdrawal failed!");
        // require(currencyToken.allowance(address(this), storeAddress) >= storeAllowance, "Actual allowance is less than our allowance value!");
        // IERC20(acceptableCurrencies[0]).transferFrom(address(this), storeAddress, currencyAllowance[acceptableCurrencies[0]] + NFTPricePaid[NFTid]);
        
        // emit PreorderRedeemed(NFTid);

        // This emits the NFT ID, the store will need to listen for this event
        // Then the store should look up the product ID by its NFT ID
        // Then the store should look up the product and check it's SKU
        // Finally, the store should ship out the real life product matching that sku
    }

    /**
     * @dev Approves the entire balance for a Product in each acceptableCurrency to be withdrawn by msg.sender
     * @param NFTid The NFT to refund.
     */ 
    function refundPreorder(uint NFTid) external ifRedeemable(NFTid) onlyNFTowner(NFTid, msg.sender) {
        // Require that the NFT with Token ID NFTid actually exists
        require(_exists(NFTid), "NFT doesn't exist!");
        // Require that msg.sender is the owner of the NFT with Token ID NFTid
        // require(ownerOf(NFTid) == msg.sender, "Only the NFT's owner can refund it");
        // Require that the NFT is redeemable
        require(isNFTUseable[NFTid], "This NFT is not refundable, it may have already been refunded or redeemed!");
        // Get the product
        uint _productId = getProductByNFT(NFTid);
        IProduct.Product memory _product = IProduct(productAddress).getProduct(_productId);
        // Require that the Product's non-refundable period has passed
        require(IProduct(productAddress).isProductRefundable(_productId), "This product is not refundable yet!");
        // Approve the amount to be transfered to the customer
        require(IERC20(boughtWith[NFTid]).approve(msg.sender, NFTPricePaid[NFTid]), "Approval for future withdrawal failed!");
        // Send the amount the original customer paid to the current owner of the NFT
        require(IERC20(boughtWith[NFTid]).transfer(msg.sender, NFTPricePaid[NFTid]), "Refund transfer failed!");
        // Set useable status to false so it cannot be redeemed or refunded again
        isNFTUseable[NFTid] = false;
        unitsRefunded[_productId] += 1;
        storeUnitsRefunded[_product.seller] += 1;

        // If this order has a funder, try to reassign the funder
        if (isNFTFunded[NFTid]) {
            _fundPreorder(fundedWith[NFTid], _productId, NFTfunder[NFTid], NFTid);
            isNFTFunded[NFTid] = false;
        }

        // TODO: Maybe we should burn the NFT after it is refunded? It's kinda useless now.
        // emit PreorderRefunded(NFTid);
    }

    function getUnfundedNFT(address currency, uint productId) public view returns(uint) {
        IProduct.Product memory _product = IProduct(productAddress).getProduct(productId);
         // Require currency is acceptable and active
        require(IProduct(productAddress).isCurrencyAcceptable(_product.seller, currency), "Currency is not acceptable!");
        require(IProduct(productAddress).isCurrencyActive(_product.seller, currency), "Currency is not active!");
        uint _NFTid = 0;
        for (uint i; i <= totalSupply(); i++) {
            if (getProductByNFT(i) == productId && !isNFTFunded[i] && isNFTUseable[i]) {
                _NFTid = i;
                return _NFTid;
            }
        }
        return 0;
    }

    function _fundPreorder(address currency, uint productId, address funder, uint previouslyFundedNFTid) internal returns(bool) {

        // TODO: Need to check if product is Fundable

        IProduct.Product memory _product = IProduct(productAddress).getProduct(productId);
        uint _NFTid = getUnfundedNFT(currency, productId);
        // If this is a new funder...
        if (previouslyFundedNFTid == 0) {
            // If no fundable order was found return false
            if (_NFTid == 0){
                return false;
            }
            // Otherwise assign the funder to an order
            // Require a succesful transfer of the currency from the user to this contract
            require(IERC20(currency).transferFrom(funder, address(this), _product.wholesalePrice), "Transaction failed");
            funderAmountPaid[_NFTid] = _product.wholesalePrice;
            funderRate[_NFTid] = _product.funderRate;
            fundedTimestamp[_NFTid] = uint256(block.timestamp);
        // Else if the funder was funding a different order, but that order was just refunded...
        } else {
            // If no fundable order was found...
            if (_NFTid == 0) {
                // If this funder was not orphaned before add this funder to the orphaned funders list and increment the counter
                if (!NFTwasOrphaned[previouslyFundedNFTid]) {
                    NFTwasOrphaned[previouslyFundedNFTid] = true;
                    orphanedFundersCount[productId]++;
                    uint256 index = getOrphanedFundersCount(productId);
                    orphanedFunderNFTid[productId][index - 1] = previouslyFundedNFTid;
                }
                return false;
            }
            // Otherwise assign the funder to a new order
            funderAmountPaid[_NFTid] = funderAmountPaid[previouslyFundedNFTid];
            funderRate[_NFTid] = funderRate[previouslyFundedNFTid];
            fundedTimestamp[_NFTid] = fundedTimestamp[previouslyFundedNFTid];
            // If this funder was orphaned before decrement counter and re-index entire list....
            if (NFTwasOrphaned[previouslyFundedNFTid]) {
                orphanedFundersCount[productId]--;
                uint orphanedLength = getOrphanedFundersCount(productId);
                for (uint i = 0; i < orphanedLength; i++) {
                    orphanedFunderNFTid[productId][i] = orphanedFunderNFTid[productId][i + 1];
                }
            }
        }
        // Change the funded status to true
        isNFTFunded[_NFTid] = true;
        // Record what address funded this NFT
        NFTfunder[_NFTid] = funder;
        fundedWith[_NFTid] = currency;
        return true;
    }

    function fundPreorder(address currency, uint productId) external {
        // NOTE: Potential funder should call getUnfundedNFT first to make sure one is available to fund
        address funder = msg.sender;
        bool _funded = _fundPreorder(currency, productId, funder, 0);
        // If we couldn't find a Preorder to fund, add funder to
        require(_funded, "No available Preorders found to fund!");
    }

    // TODO: Need to make this only callable by the owner or an admin
    /**
     * @dev Approves the entire balance for a Product in each acceptableCurrency to be withdrawn by msg.sender
     * @param _productId The Product with the balances to send.
     */ 
    // function withdrawAllProductCurrenciesBalance(uint _productId) onlySeller(_productId, msg.sender) external {
    //     // For each currency the store has ever accepted, send the entire balance related to this Product ID to the msg.sender
    //     for (uint i = 0; i < getCurrenciesLength(); i++) {
    //         // Only transfer if the balance is greater than 0
    //         if (productBalances[_productId][getAcceptableCurrencyByIndex(i)] < 0) {
    //             // Approve the amount to be sent to the msg.sender
    //             address _currency = getAcceptableCurrencyByIndex(i);
    //             IERC20(_currency).approve(msg.sender, productBalances[_productId][getAcceptableCurrencyByIndex(i)]);
    //             // TODO: Might need to verify that the amount is allowed for this currency before we try transferFrom
    //             // IERC20(_currency).transferFrom(address(this), msg.sender, productBalances[_productId][getAcceptableCurrencyByIndex(i)]);
    //             // TODO: I think msg.sender needs to listen for an event to know that the transfer is approved for them
    //         }
    //     }
    // }

    // TODO: Need to make this only callable by the owner or an admin
    /**
     * @dev Approves the entire balance for a Product in each acceptableCurrency to be withdrawn by msg.sender
     * @param amount The amount to approve.
     * @param currency The currency to withdraw the balance of.
     */ 
    function withdrawSpecificCurrencyBalance(uint amount, address currency) external returns(uint256) {
        // TODO: Might need to verify that the amount is allowed for this currency before we try transferFrom
        IERC20(currency).transfer(msg.sender, amount);
        return amount;
    }

    function affiliateRegistration(string memory affiliateCode, uint8 percentage) public {
        require(!isAffiliate[_msgSender()], "You are already an affiliate!");
        require(getAffiliateByCode(affiliateCode) == address(0), "This code is already taken");
        require(percentage > 0 && percentage < 100, "The percentage you share with cutomers must be between 0 and 100");
        codeToAffiliate[affiliateCode] = _msgSender();
        affiliateToCode[_msgSender()] = affiliateCode;
        isAffiliate[_msgSender()] = true;
        affiliateSharedPercentage[_msgSender()] = percentage;
    }

    function getAffiliateCode(address affiliate) public view returns(string memory) {
        require(isAffiliate[affiliate], "This address is not an Affiliate!");
        return affiliateToCode[affiliate];
    }

    function getAffiliateByCode(string memory affiliateCode) public view returns(address) {
        // require(codeToAffiliate[affiliateCode] != address(0), "No Affiliate exists with this code!");
        return codeToAffiliate[affiliateCode];
    }

    function getAffiliateSharedPercentage(address affiliate) public view returns(uint8) {
        // require(isAffiliate[msg.sender], "This address is not an Affiliate!");
        return affiliateSharedPercentage[affiliate];
    }

    function changeAffiliateCode(string memory oldCode, string memory newCode) public {
        require(isAffiliate[_msgSender()], "You need to register as an Affiliate before calling this function!");
        require(codeToAffiliate[oldCode] == _msgSender(), "You must provide your current code, and you desired new code!");
        require(getAffiliateByCode(newCode) == address(0), "This code is already taken");
        codeToAffiliate[oldCode] = address(0);
        codeToAffiliate[newCode] = _msgSender();
        affiliateToCode[_msgSender()] = newCode;
    }

    function changeAffiliateSharedPercentage(uint8 percentage) public {
        require(isAffiliate[_msgSender()], "You need to register as an Affiliate before calling this function!");
        require(percentage > 0 && percentage < 100, "The percentage you share with cutomers must be between 0 and 100");
        affiliateSharedPercentage[_msgSender()] = percentage;
    }
    
    function getProductByNFT(uint NFTid) public view returns(uint) {
        return NFTtoProduct[NFTid];
    }

    function getNFTaffiliate(uint NFTid) public view returns(address) {
        // require(NFTaffiliate[NFTid] != address(0), "Affiliate is the zero address!");
        return NFTaffiliate[NFTid];
    }

    function getNFTaffiliateAmountDue(uint NFTid) public view returns(uint256) {
        return NFTaffiliateAmountDue[NFTid];
    }

    function getNFTstoreAmountDue(uint NFTid) public view returns(uint256) {
        return NFTstoreAmountDue[NFTid];
    }

    function getUnitsSold(uint productID) public view productExists(productID) returns(uint64) {
        // require(productID <= productCounter, "Product ID is out of bounds");
        return unitsSold[productID];
    }
    
    function getUnitsRedeemed(uint productID) public view productExists(productID) returns(uint64) {
        // require(productID <= productCounter, "Product ID is out of bounds");
        return unitsRedeemed[productID];
    }

    function getUnitsRefunded(uint productID) public view productExists(productID) returns(uint64) {
        // require(productID <= productCounter, "Product ID is out of bounds");
        return unitsRefunded[productID];
    }

    function getUnitsReceived(uint productID) public view productExists(productID) returns(uint64) {
        // require(productID <= productCounter, "Product ID is out of bounds");
        return unitsReceived[productID];
    }

    function getProductCurrencyBalance(uint productID, address currency) public view returns(uint256) {
        return productBalances[productID][currency];
    }

    function getOrphanedFundersCount(uint256 productID) public view returns(uint256) {
        return orphanedFundersCount[productID];
    }

    function getOrphanedFunderNFTidByIndex(uint256 productID, uint256 index) public view returns(uint) {
        return orphanedFunderNFTid[productID][index];
    }

    /**
     * @dev Returns an array of amounts. Note that item[i] in the array will corrospond to acceptableCurrencies[i]
     * @param _productID The Product to get the current balances from.
     */ 
    function getProductBalances(uint _productID) public view returns(uint[] memory) {
        uint256[] memory balances = new uint256[](IProduct(productAddress).getCurrenciesLength());
        for (uint256 i = 0; i < IProduct(productAddress).getCurrenciesLength(); i++) {
            address _currency = IProduct(productAddress).getAcceptableCurrencyByIndex(i);
            balances[i] = getProductCurrencyBalance(_productID, _currency);
        }
        // Note: The index of each balance will match the index of the currency in the acceptableCurrencies array
        // So the user can look up that currencies address
        return balances;
    }

}