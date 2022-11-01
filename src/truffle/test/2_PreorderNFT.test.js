// Load dependencies
const { expect, assert } = require('chai');

const { deployProxy, upgradeProxy} = require('@openzeppelin/truffle-upgrades');
 
// Load compiled artifacts
const PreorderNFTProxy = artifacts.require('PreorderNFTProxy');
const PreorderNFT = artifacts.require('PreorderNFT');
const ProductFactoryProxy = artifacts.require('ProductFactoryProxy');
const ProductPostable = artifacts.require('ProductPostable');
const userAddress = "0xD7a3D35d5eCdB855F3C0981967f5f30FC6846b7A";
// const mockUSDC = '0xc7727a194a7BeE9dE33bE0BF5230fF0CCCB78C7B';

const StablecoinProxy = artifacts.require('StablecoinProxy');
const Stablecoin = artifacts.require('Stablecoin');

 
// Start test block
contract('PreorderNFT', function (accounts) {
    let currentOwner = null;
    let _contract = null;
    let me = accounts[0];
    let other = accounts[1];
    let productId = 0;
    let price = 1;
    console.log("currentOwner: " + currentOwner);
    console.log("me: " + me);
    console.log("other: " + other);
    beforeEach(async function () {
        // Deploy a new Staking contract for each test
        // this.preorderNFT = await PreorderNFT.new();
        // _contract = await PreorderNFT.deployed();
        this.stablecoinProxy = await deployProxy(StablecoinProxy, [userAddress]);
        this.stablecoin = await upgradeProxy(this.stablecoinProxy.address, Stablecoin);
        _productFactoryProxy = await deployProxy(ProductFactoryProxy, [this.stablecoinProxy.address]);
        _productFactory = await upgradeProxy(_productFactoryProxy.address, ProductPostable);
        _contractProxy = await deployProxy(PreorderNFTProxy, [_productFactoryProxy.address, this.stablecoinProxy.address]);
        _contract = await upgradeProxy(_contractProxy.address, PreorderNFT);
        console.log("this.stablecoinProxy.address: ", this.stablecoinProxy.address);
        // currentOwner = await _contract.owner();
  });
 
  // it('Checks if mock USDC is in the acceptableCurrencies mapping', async function () {
  //   const acceptable = await _productFactory.isCurrencyAcceptable(me, this.stablecoinProxy.address);
  //   assert.equal(acceptable, true, 'Mock USDC should be acceptable');
  // });

  it('Adds a new currency to be accepted, then checks that its acceptable', async function () {
    const newCurrency = '0x2066d76386A5eE760cA5390D9abF6da5882A3626';
    const added = await _productFactory.addAcceptableCurrency(newCurrency);
    // const currencyArray = await _contract.acceptableCurrencies();
    const acceptable = await _productFactory.isCurrencyAcceptable(me, newCurrency);
    assert.equal(acceptable, true, 'New currency should be acceptable')
  })
  
    it('Returns mints a bunch of fake USDC for the user', async function () {
      await this.stablecoin.newMint(me, 10);
      const balance = await this.stablecoin.balanceOf(me);
      console.log("balance: ", balance);
      expect(parseInt(balance)).to.gt(0);
    });
  
    it('checks if current balance is 100,000,000 (10,000.000000000000000010) USDC since it has 18 decimal places)', async function () {
      // Check balance of me
      const balance = await this.stablecoin.balanceOf(me);
      // Test if the balance is greater than 0
      expect(parseInt(balance)).to.equal(10000000000000000000010);
    });
    
  // Test case
  it('Posts a new product', async function () {
    const accnts = await web3.eth.getAccounts();
    console.log("accnts: ", accnts);
    const Affiliate = accnts[1];
    const Store = accnts[2];
    const Funder = accnts[3];
    const Buyer = accnts[4];
    console.log("Buyer: ", Buyer);

    // Mint some funds for the Buyer to spend
    const newMintAmount = 100;
    await this.stablecoin.newMint(Store, web3.utils.toWei(newMintAmount.toString(), "ether" ));
    // await this.stablecoin.newMint(Funder, web3.utils.toWei(newMintAmount.toString(), "ether" ));
    await this.stablecoin.approve(Buyer, web3.utils.toWei(newMintAmount.toString(), "ether" ), { from: me });
    await this.stablecoin.transfer(Buyer, web3.utils.toWei(newMintAmount.toString(), "ether" ), { from: me });
    await this.stablecoin.approve(Funder, web3.utils.toWei(newMintAmount.toString(), "ether" ), { from: me });
    await this.stablecoin.transfer(Funder, web3.utils.toWei(newMintAmount.toString(), "ether" ), { from: me });
    const BuyerBalance = await this.stablecoin.balanceOf(Buyer);
    console.log("BuyerBalance: ",  web3.utils.fromWei(BuyerBalance.toString(), "ether" ));
    const FunderBalance = await this.stablecoin.balanceOf(Funder);
    console.log("FunderBalance: ",  web3.utils.fromWei(FunderBalance.toString(), "ether" ));


    // First we register as an affiliate
    await _contract.affiliateRegistration("Torb", 60, { from: Affiliate });

    // Then we test all affiliate getters and setters
    const myCode = await _contract.getAffiliateCode(Affiliate);
    console.log("myCode: ", myCode);
    assert.equal(myCode, "Torb", "This code should be 'Torb'");
    const affiliateAddress = await _contract.getAffiliateByCode("Torb");
    console.log("affiliateAddress: ", affiliateAddress);
    assert.equal(affiliateAddress, Affiliate, "This affiliate should be the Affiliate");
    const myPercentage = await _contract.getAffiliateSharedPercentage(Affiliate);
    console.log("myPercentage: ", myPercentage.toNumber());
    assert.equal(myPercentage.toNumber(), 60, "My percentage should be as set above")
    await _contract.changeAffiliateCode("Torb", "Muddy", { from: Affiliate });
    const newCode = await _contract.getAffiliateCode(Affiliate);
    console.log("newCode: ", newCode);
    assert.equal(newCode, "Muddy", "This code should be 'Muddy'");
    const sameAddress = await _contract.getAffiliateByCode("Muddy");
    console.log("sameAddress: ", sameAddress);
    assert.equal(sameAddress, Affiliate, "This affiliate should be the affiliate");
    await _contract.changeAffiliateSharedPercentage(40, { from: Affiliate});
    const newPercentage = await _contract.getAffiliateSharedPercentage(Affiliate);
    console.log("newPercentage: ", newPercentage.toNumber());
    assert.equal(newPercentage.toNumber(), 40, "My percentage should be as set above")

    // Next we post a new product
    const newWholesalePrice = 6;
    const newRetailPrice = 12;
    await _productFactory.postProduct("ProductName", web3.utils.toWei(newWholesalePrice.toString(), "ether" ), web3.utils.toWei(newRetailPrice.toString(), "ether" ), 20, 30, 7, false, true, { from: Store });
    console.log("posted successfully");

    // Check if the product was posted
    const refID = await _productFactory.getProductIdBySKU(Store, "ProductName");
    console.log("refID: " + refID);
    const productRef = await _productFactory.getProduct(refID);
    console.log("price: " + productRef.retailPrice);

    // Now we approve to spend an amount equal to the product's retail price, after sales are subtracted
    const address0 = '0x0000000000000000000000000000000000000000';
    const quotedPrice = await _contract.getQuote(this.stablecoinProxy.address, refID, Affiliate);
    console.log("quotedPrice: ", web3.utils.fromWei(quotedPrice.toString(), "ether" ));
    const approved = await this.stablecoin.approve(_contractProxy.address, quotedPrice, { from: Buyer });
    console.log("approved: " + {approved});
    const allowance = await this.stablecoin.allowance(Buyer, _contractProxy.address);
    console.log("allowance: " + allowance);
    
    // Check the platform's balance before buying NFT
    const platformBalance = await this.stablecoin.balanceOf(_contractProxy.address);
    console.log("platfromBalance: ", web3.utils.fromWei(platformBalance.toString(), "ether" ));
    
    // Buy the NFT
    const resp = await _contract.purchasePreorder(this.stablecoinProxy.address, refID, Affiliate, { from: Buyer });
    console.log("resp: " + resp);
    console.log("events: " + resp.events);
    const balance = await _contract.balanceOf(Buyer);
    console.log("balance: ", balance.toNumber());
    // Test if the NFT purchase worked as intended and we have a balance
    expect(parseInt(balance)).to.gt(0);
    assert.equal(parseInt(balance), 1, 'balance should be 1');
    
    // Check the platform's balance after buying NFT
    const newPlatformBalance = await this.stablecoin.balanceOf(_contractProxy.address);
    console.log("newPlatfromBalance: ",web3.utils.fromWei(newPlatformBalance.toString(), "ether" ));
    
    
    // Check that the NFT now exists and belongs to me
    const length = await _contract.totalSupply();
    console.log("length: ", length.toNumber());
    // const list = await _contract.getNFTsByOwner(me);
    // console.log("list: ", list);

    // Fund the preorder 
    await this.stablecoin.approve(_contractProxy.address, productRef.wholesalePrice, { from: Funder });
    const fundingAmount = await this.stablecoin.allowance(Funder, _contractProxy.address);
    console.log("fundingAmount: ", fundingAmount);
    const funded = await _contract.fundPreorder(this.stablecoinProxy.address, refID, { from: Funder});
    
    // Check the amounts due to the Store, Affiliate and Funder
    const affiliateAmoutDue = await _contract.getNFTaffiliateAmountDue(refID);
    console.log("affiliateAmoutDue: ", web3.utils.fromWei(affiliateAmoutDue.toString(), "ether" ));
    const storeAmountDue = await _contract.getNFTstoreAmountDue(refID);
    console.log("storeAmountDue: ", web3.utils.fromWei(storeAmountDue.toString(), "ether" ));
    
    // Update Product to make it redeemable
    const updated = await _productFactory.updateProduct(refID, web3.utils.toWei(newWholesalePrice.toString(), "ether" ), web3.utils.toWei(newRetailPrice.toString(), "ether" ), 20, 30, true, true, { from: Store });
    console.log("updated: ", updated);
    // assert.equal(updated, true, "Updating should have succeeded");
    
    // Check that product is redeemable
    const newProductRef = await _productFactory.getProduct(refID);
    assert.equal(newProductRef.redeemable, true, "Product should be redeemable");
    const acceptableForProduct = await _productFactory.isCurrencyAcceptableForProduct(refID, this.stablecoinProxy.address);
    console.log("acceptableForProduct: ", acceptableForProduct);
    assert.equal(acceptableForProduct, true, "Currency should be acceptable for this product");

    // Redeem our order for the product
    let list = [];
    let tokenToRedeem;
    for (let i = 0; i < balance; i++) {
      let thisTokenID = await _contract.tokenOfOwnerByIndex(Buyer, i);
      list.push(thisTokenID);
      const thisProductID = await _contract.getProductByNFT(thisTokenID);
      console.log("thisProductID: ", thisProductID);
      const thisProduct = await _productFactory.getProduct(thisProductID);
      console.log("thisProduct.sku: ", thisProduct.sku);
      if (thisProduct.sku == "ProductName") tokenToRedeem = thisTokenID;
    }
    // const tokenToRedeem = await _contract.checkNFTOwnershipBySku(me, "ProductName");
    console.log("tokenToRedeem: ", tokenToRedeem.toNumber());
    const exists = await _contract.getProductByNFT(tokenToRedeem);
    // assert.equal(exists, true, 'The preorderNFT should exist');
    expect(parseInt(exists)).to.gt(0);
    const NFTowner = await _contract.ownerOf(tokenToRedeem);
    assert.equal(NFTowner, Buyer, 'The owner should be me');
    // Check that supply of NFT's has been incremented above 0
    const supply = await _contract.totalSupply();
    console.log("supply: " + supply);
    expect(parseInt(supply)).to.gt(0);
    // Try to redeem the NFT
    const pricePaid = await _contract.NFTPricePaid(tokenToRedeem);
    console.log("pricePaid: " + pricePaid);
    const redeem = await _contract.redeemPreorder(tokenToRedeem, { from: Buyer });
    console.log("redeem: " + {redeem});

    // Now the store withdraws the allowed amount that the customer paid
    console.log("this.stablecoinProxy.address: " + this.stablecoinProxy.address);
    const currency1 = await _productFactory.getStoreCurrencyByIndex(Store, 0);
    console.log("currency1: " + currency1);
    const productBalance = await _contract.getProductCurrencyBalance(refID, this.stablecoinProxy.address);
    console.log("productBalance: ", web3.utils.fromWei(productBalance.toString(), "ether" ));
    const storeAllowance = await this.stablecoin.allowance(_contractProxy.address, Store);
    console.log("storeAllowance: ", web3.utils.fromWei(storeAllowance.toString(), "ether" ));
    expect(parseInt(storeAllowance)).to.gt(0);
    const storeWithdrawal = await _contract.withdrawSpecificCurrencyBalance(storeAllowance, this.stablecoinProxy.address, { from: Store })
    // console.log("storeWithdrawal: ", storeWithdrawal);
    const storeBalance = await this.stablecoin.balanceOf(Store);
    console.log("storeBalance: ", web3.utils.fromWei(storeBalance.toString(), "ether" ));

    const affiliateAllowance = await this.stablecoin.allowance(_contractProxy.address, Affiliate);
    console.log("affiliateAllowance: ", web3.utils.fromWei(affiliateAllowance.toString(), "ether" ));
    const affiliateWithdrawal = await _contract.withdrawSpecificCurrencyBalance(affiliateAllowance, this.stablecoinProxy.address, { from: Affiliate });
    const affiliateBalance = await this.stablecoin.balanceOf(Affiliate);
    console.log("affiliateBalance: ", web3.utils.fromWei(affiliateBalance.toString(), "ether" ));

    const funderAllowance = await this.stablecoin.allowance(_contractProxy.address, Funder);
    console.log("funderAllowance: ", web3.utils.fromWei(funderAllowance.toString(), "ether" ));
    const funderWithdrawal = await _contract.withdrawSpecificCurrencyBalance(funderAllowance, this.stablecoinProxy.address, { from: Funder });
    const funderBalance = await this.stablecoin.balanceOf(Funder);
    console.log("funderBalance: ", web3.utils.fromWei(funderBalance.toString(), "ether" ));
  });

  // it('Returns the first product', async function () {
  //   const product = await _contract.products(0);
  //   // Test if the NFT purchase worked as intended and we have a balance
  //   // assert.equal(product, {price}, 'Products should not be null');
  //   console.log("product: " + product);
  //   // expect(product).to.equal(0xD7a3D35d5eCdB855F3C0981967f5f30FC6846b7A,5,25,0x4f70656e00000000000000000000000000000000000000000000000000000000);
  // });

  // it('Returns the balance of the currency token that the buyer has', async function () {
  //   const balance = await _contract.getBuyerBalance(me);
  //   // Test if the NFT purchase worked as intended and we have a balance
  //   expect(parseInt(balance)).to.gt(0);
  //   expect(parseInt(balance)).to.equal(10000000000000000000010);
  // });

  // it('Returns the balance of the currency token THINKS that the msg.sender has', async function () {
  //   const balance = await _contract.senderBalance();
  //   // Test if the NFT purchase worked as ntended and we have a balance
  //   expect(parseInt(balance)).to.gt(0);
  //   expect(parseInt(balance)).to.equal(10000000000000000000010);
  // });

  // it('Checks that the user has a balance greater than the product price', async function () {
  //   const product = await _contract.getProduct(0);
  //   const balance = await this.stablecoin.balanceOf(me);
  //   // Test if the NFT purchase worked as intended and we have a balance
  //   expect(parseInt(product.price)).to.lt(parseInt(balance));
  // });

  // it('Checks that the MSG.SENDER has a balance greater than the product price', async function () {
  //   const product = await _contract.products(0);
  //   const balance = await _contract.senderBalance2();
  //   // Test if the NFT purchase worked as intended and we have a balance
  //   expect(parseInt(product.price)).to.lt(parseInt(balance));
  // });

  // it('Tries to just transfer the product.price to the contract', async function () {
  //   const product = await _contract.products(0);
  //   const sent = await this.stablecoin.transfer(other, product.price);
  //   const balance = await this.stablecoin.balanceOf(other);
  //   console.log("product.price: " + product.price);
  //   console.log("balance: " + balance);
  //   // assert.equal(sent, true, 'sent should be true');
  //   expect(parseInt(balance)).to.gte(parseInt(product.price));
  // });

  // it('Sets and checks the allownace of the contract on behalf of msg.sender', async function () {
  //   const product = await _contract.products(0);
  //   const approved = await this.stablecoin.approve(_contract.address, product.price);
  //   const allowance = await this.stablecoin.allowance(me, _contract.address);

  //   console.log("product.price: " + product.price);

  //   console.log("allowance: " + allowance);
  //   // assert.equal(sent, true, 'sent should be true');
  //   expect(parseInt(allowance)).to.gte(parseInt(product.price));
  // });

  // it('Checks that the status of the product is Open', async function () {
  //   const product = await _contract.products(0);
  //   console.log('status: ' + product.status);
  //   assert.equal(product.redeemable, true, "Status should be Open");
  // })

  // it('Mints a new NFT representing a preorder and sends the NFT to msg.sender', async function () {
  //   console.log("contract.address: " + _contract.address);
  //   // const address = await _contract.getAddress();
  //   // console.log("address: " + address);
  //   // const sender = await _contract.getSender();
  //   // console.log("sender: " + sender);
  //   console.log("me: " + me);
  //   const product = await _contract.products(0);
  //   const approved = await this.stablecoin.approve(_contract.address, product.price);
  //   const allowance = await this.stablecoin.allowance(me, _contract.address);
  //   console.log("product.price: " + product.price);
  //   console.log("allowance: " + allowance);
  //   const resp = await _contract.purchasePreorder(me, 0, {from: me});
  //   console.log("resp: " + parseInt(resp));
  //   const balance = await _contract.balanceOf(me);
  //   // Test if the NFT purchase worked as intended and we have a balance
  //   expect(parseInt(balance)).to.gt(0);
  //   assert.equal(parseInt(balance), 1, 'balance should be 1');
  // });

  // it('Gets my current balance of NFTs', async function () {
  //   const balance = await _contract.balanceOf(me);
  //   // Test that we only purchased a single NFT
  //   expect(parseInt(balance)).to.equal(1);
  //   assert.equal(parseInt(balance), 1, 'balance should be 1');
  // });

  // it('Checks the owner of the NFT', async function () {
  //   let tokenId = 0;
  //   // TODO: Need to get the tokenId of this newly mintedNFT
  //   // tokenId = resp.id;
  //   const exists = await _contract.preorderExists(tokenId);
  //   assert.equal(exists, true, 'The preorderNFT should exist');
  //   const NFTowner = await _contract.ownerOf(tokenId);
  //   assert.equal(NFTowner, me, 'The owner should be me');
  // });

  // it("Mints a second NFT and sends the NFT to msg.sender", async function () {
  //   const product = await _contract.products(1);
  //   const approved = await this.stablecoin.approve(_contract.address, product.price);
  //   const resp2 = await _contract.purchasePreorder(this.stablecoinProxy.address, 1, {from: me});
  //   const balance = await _contract.balanceOf(me);
  //   // Test if the NFT purchase worked as intended and we have a balance
  //   expect(parseInt(balance)).to.equal(2);
  //   assert.equal(parseInt(balance), 2, 'balance should be 2');
  // });

  // it("Redeems a preorder NFT for the product it represents", async function () {
  //   let NFTid = 0;
  //   const product = await _contract.products(1);
  //   const approved = await this.stablecoin.approve(_contract.address, product.price);
  //   const resp = await _contract.purchasePreorder(this.stablecoinProxy.address, 1, {from: me});

  //   const supply = await _contract.totalSupply();
  //   console.log("supply: " + supply);
  //   expect(parseInt(supply)).to.gt(0);
  //   const exists = await _contract.preorderExists(NFTid);
  //   assert.equal(exists, true, 'The preorderNFT should exist');
  //   const NFTowner = await _contract.ownerOf(NFTid);
  //   console.log("owner: " + NFTowner);
  //   assert.equal(NFTowner, me, 'The owner should be me')
  //   const redeem = await _contract.redeemPreorder(NFTid);
  //   console.log("redeem: " + redeem);
  // })

});