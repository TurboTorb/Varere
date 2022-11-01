<script>

import { onMount } from 'svelte';
import { browser } from '$app/env';
import { theme, web3js } from '../../stores';
import Checkbox from '$lib/checkbox.svelte';
import Utils from '$lib/utils.js';
import ProductFactory from '../../truffle/build/contracts/ProductPostable.json';
import PreorderNFT from '../../truffle/build/contracts/PreorderNFT.json';
import Stablecoin from '../../truffle/build/contracts/Stablecoin.json';

// We will be interacting with our upgradeable contracts through the ProxyAddresses
let preorderNFTProxyAddress;
let preorderNFTContract;
let productFactoryProxyAddress;
let productFactoryContract;
let stablecoinProxyAddress;
let stablecoinContract;
let recentProductID;

let groups = [
    { name: "Shirts", products: [
        { name: "Men's Shirt", sku: 'SKU90201', img: '/assets/img/products/p1.png', retailPrice: 75.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 45, preorderable: true, fundable: true, redeemable: false, editing: false },
        { name: 'Black Shirt', sku: 'SKU90203', img: '/assets/img/products/p2.png', retailPrice: 55.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 50, preorderable: true, fundable: true, redeemable: true, editing: false },
        { name: "Men's Shirt", sku: 'SKU90205',img: '/assets/img/products/p8.png', retailPrice: 55.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 25, preorderable: true, fundable: true, redeemable: false, editing: false },
        { name: "Men's Shirt", sku: 'SKU90206',img: '/assets/img/products/p9.png', retailPrice: 30.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 12, preorderable: true, fundable: false, redeemable: false, editing: false },
        { name: "Men's Shirt", sku: 'SKU90208',img: '/assets/img/products/p10.png', retailPrice: 67.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 26, preorderable: false, fundable: false, redeemable: false, editing: false },
        { name: "Men's Shirt", sku: 'SKU90209',img: '/assets/img/products/p11.png', retailPrice: 89.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 79, preorderable: true, fundable: true, redeemable: true, editing: false }
    ] },
    { name: "Dresses", products: [
        { name: 'Dress 1', sku: 'SKU90401', img: '/assets/img/products/p3.png', retailPrice: 50.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 410, preorderable: true, fundable: true, redeemable: true, editing: false },
        { name: 'Dress 2', sku: 'SKU90405', img: '/assets/img/products/p4.png', retailPrice: 65.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 230, preorderable: false, fundable: true, redeemable: false, editing: false },
        { name: 'Dress 3', sku: 'SKU90406', img: '/assets/img/products/p5.png', retailPrice: 85.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 40, preorderable: true, fundable: true, redeemable: false, editing: false },
        { name: 'Dress', sku: 'SKU90408', img: '/assets/img/products/p7.png', retailPrice: 50.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 21, preorderable: true, fundable: true, redeemable: false, editing: false }
    ]}
]

// Mock array of products
let products = [
    { name: "Men's Shirt", sku: 'SKU90201', img: '/assets/img/products/p1.png', retailPrice: 75.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 45, preorderable: true, fundable: true, redeemable: false, editing: false },
    { name: 'Black Shirt', sku: 'SKU90203', img: '/assets/img/products/p2.png', retailPrice: 55.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 50, preorderable: true, fundable: true, redeemable: true, editing: false },
    { name: 'Dress 1', sku: 'SKU90401', img: '/assets/img/products/p3.png', retailPrice: 50.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 410, preorderable: true, fundable: true, redeemable: true, editing: false },
    { name: 'Dress 2', sku: 'SKU90405', img: '/assets/img/products/p4.png', retailPrice: 65.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 230, preorderable: false, fundable: true, redeemable: false, editing: false },
    { name: 'Dress 3', sku: 'SKU90406', img: '/assets/img/products/p5.png', retailPrice: 85.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 40, preorderable: true, fundable: true, redeemable: false, editing: false },
    // { name: 'Dress', img: '/assets/img/products/p6.png', retailPrice: 35.00, preorderCount: 34, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderable: true, fundable: true, redeemable: false, editing: false },
    { name: 'Dress', sku: 'SKU90408', img: '/assets/img/products/p7.png', retailPrice: 50.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 21, preorderable: true, fundable: true, redeemable: false, editing: false },
    { name: "Men's Shirt", sku: 'SKU90205',img: '/assets/img/products/p8.png', retailPrice: 55.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 25, preorderable: true, fundable: true, redeemable: false, editing: false },
    { name: "Men's Shirt", sku: 'SKU90206',img: '/assets/img/products/p9.png', retailPrice: 30.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 12, preorderable: true, fundable: false, redeemable: false, editing: false },
    { name: "Men's Shirt", sku: 'SKU90208',img: '/assets/img/products/p10.png', retailPrice: 67.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 26, preorderable: false, fundable: false, redeemable: false, editing: false },
    { name: "Men's Shirt", sku: 'SKU90209',img: '/assets/img/products/p11.png', retailPrice: 89.00, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderCount: 79, preorderable: true, fundable: true, redeemable: true, editing: false }
    // { name: 'Dress', img: '/assets/img/products/p12.png', retailPrice: 20.00, preorderCount: 16, wholesalePrice: 25, prefundReward: 30, affiliatePercentage: 20, preorderable: true, fundable: true, redeemable: false, editing: false }
];

onMount(async () => {
    preorderNFTProxyAddress = import.meta.env.VITE_PREORDER_NFT_PROXY_ADDRESS;
    productFactoryProxyAddress = import.meta.env.VITE_PRODUCT_FACTORY_PROXY_ADDRESS;
    stablecoinProxyAddress = import.meta.env.VITE_STABLECOIN_PROXY_ADDRESS;
    const web3js = new Web3(ethereum);
    console.log("web3js: ", web3js);
    preorderNFTContract = new web3js.eth.Contract(PreorderNFT.abi, preorderNFTProxyAddress);
    productFactoryContract = new web3js.eth.Contract(ProductFactory.abi, productFactoryProxyAddress);
    stablecoinContract = new web3js.eth.Contract(Stablecoin.abi, stablecoinProxyAddress);
    console.log("preorderNFTContract: ", preorderNFTContract);
    console.log("productFactoryContract: ", productFactoryContract);
    console.log("stablecoinContract: ", stablecoinContract);
    const storeProducts = await getStoreProducts();
    storeProducts.forEach(prod => {
        console.log("adding product to list");
        // products.push(prod);
        console.log("products.length: ", products.length);
        products = products; // refresh
    })
})

async function getStoreProducts() {
    let storeProducts = [];
    try {
        const userAddress = await Utils.getUserAddress();
        const storeProductCount = await productFactoryContract.methods.getStoreProductCount(userAddress).call();
        console.log("storeProductCount: ", storeProductCount);
        if (storeProductCount > 0) {
            for (let i = 1; i <= storeProductCount; i++) {
                let product = await productFactoryContract.methods.getStoreProduct(userAddress, i).call();
                console.log("product: ", product);
                storeProducts.push(product);
            }
        }
    } catch (error) {
        console.log("error: ", error);
    }
    return storeProducts;
}

async function saveProducts() {
    const userAddress = await Utils.getUserAddress();
    // TODO: Need to add new products to the database here with GraphQL
    // First we get an array of products currently stored in the contract
    console.log("saving...");
    const storeProductCount = await productFactoryContract.methods.getStoreProductCount(userAddress).call();
    console.log("storeProductCount: ", storeProductCount);
    let storeProducts = await getStoreProducts();
    if (storeProducts.length < 1) {
        console.log("no products found");
        return;
    }
    // Next we compare our products array with the contractsProducts array
    let unuploadedProducts = [];
    // products.forEach(prod => {
    for (let i = 0; i < products.length; i++) {
        let prod = products[i];
        let uploaded = false;
        storeProducts.forEach(sProduct => {
            if (prod.sku == sProduct.sku) {
                uploaded = true;
            }
        });
        // If this product hasn't been added to the Contract yet, consider adding it
        if (!uploaded) {
            prod.index = i;
            unuploadedProducts.push(prod);
        }
    }
    // TODO: Send al the new products in one batch
    unuploadedProducts.forEach(prod => {
        postProduct(prod.index);
    });
}

function addGroup() {
    console.log("adding group");
    let newGroup = {
        name: "",
        products: []
    }
    groups.unshift(newGroup);
    groups = groups; //refresh
}

function addProduct(i) {
    console.log("adding product");
    let newProduct = { 
        name: "Name", 
        sku: 'SKU00000',
        img: '/assets/img/products/p12.png', 
        retailPrice: 0.00, 
        wholesalePrice: 0.00, 
        prefundReward: 0.00, 
        preorderCount: 0, 
        preorderable: false, 
        fundable: false, 
        redeemable: false, 
        editing: true
    };
    // TODO: Need to add the new product to the top of the list instead of the bottom
    groups[i].products.unshift(newProduct);
    groups = groups; //refresh
    // products = products; // refresh
}


async function postProduct(i) {
    // TODO: Let the user set the price
    console.log("producst[i].price: ", products[i].retailPrice);
    // let price = 6;
    try {
        // const productId = await preorderNFTContract.methods.getProductCount().call();
        // console.log("productId: ", productId);
        // Get the user's current active account address
        const userAddress = await Utils.getUserAddress();
        console.log("userAddress: ", userAddress);
        if (!userAddress) {
            return;
        }
        let refundablePeriod = 10;
        let redeemable = false;
        let buyable = true;
        const resp = await productFactoryContract.methods.postProduct(products[i].sku, $web3js.utils.toWei(products[i].wholesalePrice.toString()), $web3js.utils.toWei(products[i].retailPrice.toString()), products[i].affiliatePercentage, products[i].prefundReward, refundablePeriod, redeemable, buyable).send({ from: userAddress });
        console.log("resp: ", resp);
        // TODO: events may need to be events[0] if we end up emitting more than one event on the call
        // recentProductID = resp.events.ProductStatusChange.returnValues[0];
        // console.log("recentProjectId: ", recentProductID);
    } catch (error) {
        console.error("error: ", error);
    }
}

</script>


<div id="content" class="app-content ml-0">
    <!-- BEGIN row -->
    <div class="row">
        <div class="col-xl-6">
            <!-- BEGIN card -->
            <div class="card mb-3">
                <!-- BEGIN card-body -->
                <div class="card-body">
                    <!-- BEGIN title -->
                    <div class="d-flex fw-bold small mb-3">
                        <span class="flex-grow-1">PRODUCT GROUPS</span>
                        <a href="#" class="text-white text-opacity-50 text-decoration-none" on:click={addGroup}><i class="fas fa-plus"></i></a>
                    </div>
                    <!-- END title -->
                    <!-- BEGIN table -->
                    <div class="table-responsive">
                        <table class="w-100 mb-0 small align-middle text-nowrap">
                            <tbody>
                                {#each groups as group, j}
                                    <tr>
                                        <td>
                                            <div class="d-flex">
                                                {#if group.name != ""}
                                                    {group.name}
                                                {:else}
                                                    <div><input type="text" class="form-control" style="max-width: 200px;" placeholder="Group" bind:value={group.name}/></div>
                                                {/if}
                                            </div>
                                        </td>
                                        <td colspan=4 class="d-flex justify-content-end">
                                            <a href="#" class="text-white text-opacity-50 text-decoration-none" on:click={() => addProduct(j)}><i class="fas fa-plus"></i></a>
                                        </td>
                                    </tr>
                                    {#each group.products as product, i}
                                        <tr>
                                            <td>
                                                <div class="d-flex">
                                                    <div class="position-relative mb-2">
                                                        <div class="bg-center bg-cover bg-no-repeat w-80px h-60px" style="background-image: url({product.img}); background-size: 80px;">
                                                        </div>
                                                        <div class="position-absolute top-0 start-0">
                                                            <span class="badge {product.preorderable ? "bg-theme" : "bg-light"} bg-theme text-theme-900 rounded-0 d-flex align-items-center justify-content-center w-20px h-20px">{i+1}</span>
                                                        </div>
                                                    </div>
                                                    <div class="flex-1 ps-3">
                                                        {#if product.editing}
                                                            <!-- <div class="mb-1"><small class="fs-9px fw-500 lh-1 d-inline-block rounded-0 badge bg-white bg-opacity-25 text-white text-opacity-75 pt-5px">SKU90400</small></div> -->
                                                            <!-- <div class="fw-500 text-white">Huawei Smart Watch</div> -->
                                                            <div><input type="text" class="form-control" style="max-width: 200px;" placeholder="SKU" bind:value={product.sku}/></div>
                                                            <div><input type="text" class="form-control" style="max-width: 200px;" placeholder="Product Name"bind:value={product.name}/></div>
                                                            <input type="number" class="form-control" style="max-width: 60px;" placeholder=0.00 bind:value={product.price}/>
                                                        {:else}
                                                            <div class="mb-1"><small class="fs-9px fw-500 lh-1 d-inline-block rounded-0 badge bg-white bg-opacity-25 text-white text-opacity-75 pt-5px">{product.sku}</small></div>
                                                            <div class="fw-500 text-white">{product.name}</div>
                                                            {Utils.formatAsCurrency(product.retailPrice, 2)}
                                                        {/if}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <table class="mb-2">
                                                    <tr>
                                                        <td class="pe-3">BUYABLE:</td>
                                                        <!-- <td class="text-white text-opacity-75 fw-500">129</td> -->
                                                        <!-- <td><input type="checkbox" bind:checked={product.preorderable}/></td> -->
                                                        <td><Checkbox bind:checked={product.preorderable}/></td>
                                                    </tr>
                                                    <tr>
                                                        <td class="pe-3">FUNDABLE:</td>
                                                        <!-- <td class="text-white text-opacity-75 fw-500">$51,471</td> -->
                                                        <td><Checkbox bind:checked={product.fundable}/></td>
                                                    </tr>
                                                    <!-- <tr>
                                                        <td class="pe-3 text-nowrap">REDEEMABLE:</td>
                                                        <td><Checkbox bind:checked={product.redeemable}/></td>
                                                    </tr> -->
                                                </table>
                                            </td>
                                            <!-- <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a></td> -->
                                            <td>
                                                <a href="#{i}" class="text-decoration-none text-white" on:click={() => product.editing = true}>
                                                    {#if product.editing}
                                                        <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-outline-theme">Save</a>
                                                    {:else}
                                                        <span>
                                                            <i class="fas fa-pen-to-square fa-xl"></i>
                                                        </span>
                                                    {/if}
                                                </a>
                                            </td>
                                        </tr>
                                    {/each}
                                {/each}
                                <!-- <tr>
                                    <td>
                                        <div class="d-flex">
                                            <div class="position-relative mb-2">
                                                <div class="bg-center bg-cover bg-no-repeat w-80px h-60px" style="background-image: url(/assets/img/dashboard/product-1.jpeg); background-size: 80px;">
                                                </div>
                                                <div class="position-absolute top-0 start-0">
                                                    <span class="badge bg-theme text-theme-900 rounded-0 d-flex align-items-center justify-content-center w-20px h-20px">1</span>
                                                </div>
                                            </div>
                                            <div class="flex-1 ps-3">
                                                <div class="mb-1"><small class="fs-9px fw-500 lh-1 d-inline-block rounded-0 badge bg-white bg-opacity-25 text-white text-opacity-75 pt-5px">SKU90400</small></div>
                                                <div class="fw-500 text-white">Huawei Smart Watch</div>
                                                $399.00
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <table class="mb-2">
                                            <tr>
                                                <td class="pe-3">PREORDERABLE:</td>
                                                <td class="text-white text-opacity-75 fw-500">129</td>
                                                <td><input type="checkbox"/></td>
                                            </tr>
                                            <tr>
                                                <td class="pe-3">FUNDABLE:</td>
                                                <td class="text-white text-opacity-75 fw-500">$51,471</td>
                                                <td><input type="checkbox"/></td>
                                            </tr>
                                            <tr>
                                                <td class="pe-3 text-nowrap">REDEEMABLE:</td>
                                                <td class="text-white text-opacity-75 fw-500">$15,441</td>
                                                <td><input type="checkbox"/></td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex mb-2 align-items-center">
                                            <div class="position-relative">
                                                <div class="bg-center bg-cover bg-no-repeat w-80px h-60px" style="background-image: url(/assets/img/dashboard/product-2.jpeg); background-size: 80px;">
                                                </div>
                                                <div class="position-absolute top-0 start-0">
                                                    <span class="badge bg-theme text-theme-900 rounded-0 d-flex align-items-center justify-content-center w-20px h-20px">2</span>
                                                </div>
                                            </div>
                                            <div class="flex-1 ps-3">
                                                <div class="mb-1"><small class="fs-9px fw-500 lh-1 d-inline-block rounded-0 badge bg-white bg-opacity-25 text-white text-opacity-75 pt-5px">SKU85999</small></div>
                                                <div class="text-white fw-500">Nike Shoes Black Version</div>
                                                $99.00
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <table class="mb-2">
                                            <tr>
                                                <td class="pe-3">QTY:</td>
                                                <td class="text-white text-opacity-75 fw-500">108</td>
                                            </tr>
                                            <tr>
                                                <td class="pe-3">REVENUE:</td>
                                                <td class="text-white text-opacity-75 fw-500">$10,692</td>
                                            </tr>
                                            <tr>
                                                <td class="pe-3 text-nowrap">PROFIT:</td>
                                                <td class="text-white text-opacity-75 fw-500">$5,346</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex mb-2 align-items-center">
                                            <div class="position-relative">
                                                <div class="bg-center bg-cover bg-no-repeat w-80px h-60px" style="background-image: url(/assets/img/dashboard/product-3.jpeg); background-size: 80px;">
                                                </div>
                                                <div class="position-absolute top-0 start-0">
                                                    <span class="badge bg-theme text-theme-900 rounded-0 d-flex align-items-center justify-content-center w-20px h-20px">3</span>
                                                </div>
                                            </div>
                                            <div class="flex-1 ps-3">
                                                <div class="mb-1"><small class="fs-9px fw-500 lh-1 d-inline-block rounded-0 badge bg-white bg-opacity-25 text-white text-opacity-75 pt-5px">SKU20400</small></div>
                                                <div class="text-white fw-500">White Sony PS4</div>
                                                $599
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <table class="mb-2">
                                            <tr>
                                                <td class="pe-3">QTY:</td>
                                                <td class="text-white text-opacity-75 fw-500">72</td>
                                            </tr>
                                            <tr>
                                                <td class="pe-3">REVENUE:</td>
                                                <td class="text-white text-opacity-75 fw-500">$43,128</td>
                                            </tr>
                                            <tr>
                                                <td class="pe-3 text-nowrap">PROFIT:</td>
                                                <td class="text-white text-opacity-75 fw-500">$4,312</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex mb-2 align-items-center">
                                            <div class="position-relative">
                                                <div class="bg-center bg-cover bg-no-repeat w-80px h-60px" style="background-image: url(/assets/img/dashboard/product-4.jpeg); background-size: 80px;">
                                                </div>
                                                <div class="position-absolute top-0 start-0">
                                                    <span class="badge bg-black bg-opacity-50 rounded-0 d-flex align-items-center justify-content-center w-20px h-20px">4</span>
                                                </div>
                                            </div>
                                            <div class="flex-1 ps-3">
                                                <div class="mb-1"><small class="fs-9px fw-500 lh-1 d-inline-block rounded-0 badge bg-white bg-opacity-25 text-white text-opacity-75 pt-5px">SKU19299</small></div>
                                                <div class="text-white fw-500">Apple Watch Series 5</div>
                                                $1,099
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <table class="mb-2">
                                            <tr>
                                                <td class="pe-3">QTY:</td>
                                                <td class="text-white text-opacity-75 fw-500">53</td>
                                            </tr>
                                            <tr>
                                                <td class="pe-3">REVENUE:</td>
                                                <td class="text-white text-opacity-75 fw-500">$58,247</td>
                                            </tr>
                                            <tr>
                                                <td class="pe-3 text-nowrap">PROFIT:</td>
                                                <td class="text-white text-opacity-75 fw-500">$2,912</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="position-relative">
                                                <div class="bg-center bg-cover bg-no-repeat w-80px h-60px" style="background-image: url(/assets/img/dashboard/product-5.jpeg); background-size: 80px;">
                                                </div>
                                                <div class="position-absolute top-0 start-0">
                                                    <span class="badge bg-black bg-opacity-50 rounded-0 d-flex align-items-center justify-content-center w-20px h-20px">5</span>
                                                </div>
                                            </div>
                                            <div class="flex-1 ps-3">
                                                <div class="mb-1"><small class="fs-9px fw-500 lh-1 d-inline-block rounded-0 badge bg-white bg-opacity-25 text-white text-opacity-75 pt-5px">SKU19299</small></div>
                                                <div class="text-white fw-500">Black Nikon DSLR</div>
                                                1,899
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <table>
                                            <tr>
                                                <td class="pe-3">QTY:</td>
                                                <td class="text-white text-opacity-75 fw-500">50</td>
                                            </tr>
                                            <tr>
                                                <td class="pe-3">REVENUE:</td>
                                                <td class="text-white text-opacity-75 fw-500">$90,950</td>
                                            </tr>
                                            <tr>
                                                <td class="pe-3 text-nowrap">PROFIT:</td>
                                                <td class="text-white text-opacity-75 fw-500">$2,848</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a></td>
                                </tr> -->
                            </tbody>
                        </table>
                    </div>
                    <!-- END table -->
                </div>
                <!-- END card-body -->
                
                <!-- BEGIN card-arrow -->
                <div class="card-arrow">
                    <div class="card-arrow-top-left"></div>
                    <div class="card-arrow-top-right"></div>
                    <div class="card-arrow-bottom-left"></div>
                    <div class="card-arrow-bottom-right"></div>
                </div>
                <!-- END card-arrow -->
            </div>
            <!-- END card -->
        </div>
    </div>
</div>

<!-- BEGIN #modalEdit -->
<div class="modal fade" id="modalEdit">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Save Changes</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">Unsaved Products</label>
                    <div class="row row-space-10">
                        <div class="col-3">
                            <span class="">Name</span>
                        </div>
                        <div class="col-2">
                            <span class="">Sku</span>
                        </div>
                        <div class="col-2">
                            <span class="">Retail Price</span>
                        </div>
                        <div class="col-2">
                            <span class="">Fund Amount</span>
                        </div>
                        <div class="col-2">
                            <span class="">Fund Reward</span>
                        </div>
                        <div class="col-1">
                            <span class="">NFT</span>
                        </div>
                    </div>
                    {#each products as product, i}
                        {#if product.editing}
                            <div class="row row-space-10">
                                <div class="col-3">
                                    <div class="form-control">{product.name}</div>
                                </div>
                                <div class="col-2">
                                    <div class="form-control">{product.sku} </div>
                                </div>
                                <div class="col-2">
                                    <div class="form-control">{Utils.formatAsCurrency(product.price, 2)}</div>
                                </div>
                                <div class="col-2">
                                    <div class="form-control">{Utils.formatAsCurrency(product.wholesalePrice, 2)}</div>
                                </div>
                                <div class="col-2">
                                    <div class="form-control">{Utils.formatAsCurrency(product.prefundReward, 2)}</div>
                                </div>
                                <div class="col-1">
                                    <Checkbox bind:checked={product.preorderable} index={i}/>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
                <!-- <div class="alert alert-muted">
                    <b>Please note:</b> 
                    If you change your name, you can't change it again for 60 days. 
                    Don't add any unusual capitalization, punctuation, characters or random words. 
                    <a href="#" class="alert-link">Learn more.</a>
                </div> -->
                <!-- <div class="mb-3"> -->
                    <!-- <label class="form-label">Add Currency</label> -->
                    <!-- <div on:click={addCurrency}> -->
                        <!-- <div>
                        <a href="#" class="btn btn-outline-default"><i class="fa fa-plus fa-fw"></i> Add currency</a>
                    </div>
                </div> -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-default" data-bs-dismiss="modal">Back</button>
                <button type="button" class="btn btn-outline-theme" data-bs-dismiss="modal" on:click={saveProducts}>Save to Contract</button>
            </div>
        </div>
    </div>
</div>
<!-- END #modalEdit -->