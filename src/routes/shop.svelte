<script context="module">
    import { createMessage, encrypt, readKey } from 'openpgp';
    /** @type {import('@sveltejs/kit').Load} */
    export async function load({ fetch }) {
        const keyOptions = {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${import.meta.env.VITE_CIRCLE_SANDBOX_API_KEY}`
			}
		};
		let keyId;
		let publicKey;
		const url = 'https://api-sandbox.circle.com/v1/encryption/public';
		const response = await fetch(url, keyOptions)
			.then(response => response.json())
			.then(response => {
				console.log(response);
				keyId = response.data.keyId;
				publicKey = response.data.publicKey;
				return {keyId, publicKey};
			})
			.catch(err => console.error(err));
		console.log("keyId: ", keyId);
		console.log("publicKey: ", publicKey);
		console.log("returned resposne: ", response);
	    const circleKeys = response;

		return {
			props: {
				circleKeys
			}
		};
    }

    /** @type {import('@sveltejs/kit').RequestHandler} */
	export async function addCard(userData) {
		const cardOptions = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${import.meta.env.VITE_CIRCLE_SANDBOX_API_KEY}`
			},
			body: JSON.stringify(userData)
		};
		const addedCard = await fetch('https://api-sandbox.circle.com/v1/cards', cardOptions)
			.then(response => response.json())
			.then(response => {console.log(response); return response.data;})
			.catch(err => console.error(err));
		console.log("addedCard: ", addedCard);
		return addedCard;
	}

	export async function encryptCard(cardDetails, circleKeys) {
		console.log("circleKeys: ", circleKeys);
		console.log("cardDetails: ", cardDetails);
		const keyId = circleKeys.keyId;
		const decodedPublicKey = await readKey({ armoredKey: atob(circleKeys.publicKey) });
		// const decodedPublicKey = await readKey({ armoredKey: Buffer.from(publicKey, 'base64') });
		console.log("decodedPublicKey: ", decodedPublicKey);
		// const message = await createMessage({ text: JSON.stringify(dataToEncrypt) });
		const message = await createMessage({ text: JSON.stringify(cardDetails) });
		return encrypt({
			message,
			encryptionKeys: decodedPublicKey,
		}).then((ciphertext) => {
			console.log("ciphertext: ", ciphertext);
			return {
			encryptedMessage: btoa(ciphertext),
			keyId,
			}
		})
	}

    // TODO: Get and use user data in here
	export async function createPayment() {
		const paymentOptions = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${import.meta.env.VITE_CIRCLE_SANDBOX_API_KEY}`
			},
			body: JSON.stringify({
				metadata: {
				email: 'satoshi@circle.com',
				phoneNumber: '+14155555555',
				sessionId: 'DE6FA86F60BB47B379307F851E238617',
				ipAddress: '244.28.239.130'
				},
				amount: {amount: '3.14', currency: 'USD'},
				autoCapture: true,
				source: {id: 'b8627ae8-732b-4d25-b947-1df8f4007a29', type: 'card'},
				idempotencyKey: 'ba943ff1-ca16-49b2-ba55-1057e70ca5c7',
				keyId: 'key1',
				// TODO: change verifcation from none to three_d_secure 
				verification: 'none',
				description: 'Payment'
			})
		};

		const payment = await fetch('https://api-sandbox.circle.com/v1/payments', paymentOptions)
		.then(response => response.json())
		.then(response => {
			console.log(response);
			return response.data;
		})
		.catch(err => console.error(err));
		return payment;
	}
</script>

<script>
    // import PageMenu from "$lib/page-menu.svelte";
    import ProductsGrid from "$lib/products-grid.svelte";
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    import PreorderNFT from '../truffle/build/contracts/PreorderNFT.json';
	import Stablecoin from '../truffle/build/contracts/Stablecoin.json';

    // We will be interacting with our upgradeable contracts through the ProxyAddresses
	let preorderNFTProxyAddress;
	let preorderNFTContract;
	let stablecoinProxyAddress;
	let stablecoinContract;
	let recentProductID;

    // Circle variables for fiat payments
	export let circleKeys;
	let userCardId;
	let newCard = {number: "4007400000000007", cvv: "777"};
	let showCardModal = false;
	// TODO: Need the user to input all this stuff
	let userData = {
				billingDetails: {
				name: 'Satoshi Nakamoto',
				city: 'Boston',
				country: 'US',
				line1: '100 Money Street',
				district: 'MA',
				postalCode: '01234'
				},
				metadata: {
				email: 'satoshi@circle.com',
				phoneNumber: '+14155555555',
				sessionId: 'DE6FA86F60BB47B379307F851E238617',
				ipAddress: '244.28.239.130'
				},
				idempotencyKey: 'ba943ff1-ca16-49b2-ba55-1057e70ca5c7',
				keyId: 'key1',
				// fdfsdgsfgg: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3Y0JNQTBYV1…MZ1oKPUo3WG4KLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo='
				encryptedData: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3Y0JNQTBYV1NGbEZScFZoQVFmL2J2bVVkNG5LZ3dkbExKVTlEdEFEK0p5c0VOTUxuOUlRUWVGWnZJUWEKMGgzQklpRFNRU0RMZmI0NEs2SXZMeTZRbm54bmFLcWx0MjNUSmtPd2hGWFIrdnNSMU5IbnVHN0lUNWJECmZzeVdleXlNK1JLNUVHV0thZ3NmQ2tWamh2NGloY29xUnlTTGtJbWVmRzVaR0tMRkJTTTBsTFNPWFRURQpiMy91eU1zMVJNb3ZiclNvbXkxa3BybzUveWxabWVtV2ZsU1pWQlhNcTc1dGc1YjVSRVIraXM5ckc0cS8KMXl0M0FOYXA3UDhKekFhZVlyTnVNZGhGZFhvK0NFMC9CQnN3L0NIZXdhTDk4SmRVUEV0NjA5WFRHTG9kCjZtamY0YUtMQ01xd0RFMkNVb3dPdE8vMzVIMitnVDZKS3FoMmtjQUQyaXFlb3luNWcralRHaFNyd3NKWgpIdEphQWVZZXpGQUVOaFo3Q01IOGNsdnhZVWNORnJuNXlMRXVGTkwwZkczZy95S3loclhxQ0o3UFo5b3UKMFVxQjkzQURKWDlJZjRBeVQ2bU9MZm9wUytpT2lLall4bG1NLzhlVWc3OGp1OVJ5T1BXelhyTzdLWTNHClFSWm8KPXc1dEYKLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQo',
				expMonth: 1,
				expYear: 2024
			}
    
    // Mock array of products
    let products = [
        { name: "Men's Shirt", img: '/assets/img/products/p1.png', price: 75, preorderCount: 45 },
        { name: 'Black Shirt', img: '/assets/img/products/p2.png', price: 55, preorderCount: 50 },
        { name: 'Dress 1', img: '/assets/img/products/p3.png', price: 50, preorderCount: 410 },
        { name: 'Dress 2', img: '/assets/img/products/p4.png', price: 65, preorderCount: 230 },
        { name: 'Dress 3', img: '/assets/img/products/p5.png', price: 85, preorderCount: 40 },
        { name: 'Dress', img: '/assets/img/products/p6.png', price: 35, preorderCount: 34 },
        { name: 'Dress', img: '/assets/img/products/p7.png', price: 50, preorderCount: 21 },
        { name: "Men's Shirt", img: '/assets/img/products/p8.png', price: 55, preorderCount: 25 },
        { name: "Men's Shirt", img: '/assets/img/products/p9.png', price: 30, preorderCount: 12 },
        { name: "Men's Shirt", img: '/assets/img/products/p10.png', price: 67, preorderCount: 26 },
        { name: "Men's Shirt", img: '/assets/img/products/p11.png', price: 89, preorderCount: 79 },
        { name: 'Dress', img: '/assets/img/products/p12.png', price: 20, preorderCount: 16 }
    ];

    let scripts = [
	    "/assets/js/demo/page-gallery.demo.js"
    ];

    onMount(async () => {
        scripts.forEach((url) => {
            const script = document.createElement('script');
            script.src = url;
            document.body.append(script);
        });
        console.log("circleKeys: ", circleKeys);
        preorderNFTProxyAddress = import.meta.env.VITE_PREORDER_NFT_PROXY_ADDRESS;
        stablecoinProxyAddress = import.meta.env.VITE_STABLECOIN_PROXY_ADDRESS;
        const web3js = new Web3(ethereum)
        console.log("web3js: ", web3js);
        preorderNFTContract = new web3js.eth.Contract(PreorderNFT.abi, preorderNFTProxyAddress);
        stablecoinContract = new web3js.eth.Contract(Stablecoin.abi, stablecoinProxyAddress);
        console.log("preorderNFTContract: ", preorderNFTContract);
        console.log("stablecoinContract: ", stablecoinContract);
        getBalanceOfContract();
        testNewCard();
    });

    async function getUserAddress() {
        try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log("accounts: ", accounts);
            if (accounts.length > 0) {
                const acct = accounts[0];
                return acct;
            } else {
                return false;
            }
        } catch (error) {
            console.error("error: ", error);
        }
    }

    async function getBalanceOfContract() {
        let userBalance;
        try {
            const userAddress = await getUserAddress();
            const contractAddress = preorderNFTProxyAddress;
            if (userAddress) {
                userBalance = await stablecoinContract.methods.balanceOf(userAddress).call();
            } else {
                userBalance = 0;
            }
            const contractBalance = await stablecoinContract.methods.balanceOf(contractAddress).call();
            console.log("userBalance: ", userBalance/1e18);
            console.log("contractBalance: ", contractBalance/1e18);
        } catch (error) {
            console.error("error: ", error);
        }
	}

    async function testNewCard() {
		const encryptedCard = await encryptCard(newCard, circleKeys);
		console.log("encryptedCard: ", encryptedCard);
		// userData.encryptedData = encryptedCard; // This breaks makes the addCard fucntion return an error
		const card = await addCard(userData);
		console.log("card: ", card);
		// TODO: We can save the user's card ID so they can use this card again on a future purchase.
		userCardId = card.id;
		const payment = await createPayment();
		console.log("payment: ", payment);
	}

    async function getProductId(i) {
        // i is the index for the product in the products array to redeem
        // TODO: The products name should really  be a unique SKU
        try {
            console.log("attmpeting to look up product ID by SKU");
            const productId = await preorderNFTContract.methods.getProductIdBySKU(products[i].name).call();
            // const productId = await preorderNFTContract.methods.getProductIdBySKU(products[i].name.toString()).send({from: userAddress});
            console.log("productId: ", productId);
            if (productId == 0) {
                console.log("Product not found");
                return;
            } else {
                checkProductStatus(productId);
            }
        } catch (error) {
            console.error("error: ", error);
        }
	}

    async function checkProductStatus(productId) {
        try {
            const status = await preorderNFTContract.methods.products(productId).call();
            console.log("status: ", status);
            console.log("buyable: ", status.buyable);
            if (status.buyable) {
                preorder(productId)
                
            }
        } catch (error) {
            console.log("Existance check error");
            console.error("error: ", error);
        }
	}

    async function preorder(productId) {
        try {
            const userAddress = await getUserAddress();
            // TODO: Set up a modal or something between the two calls to confirm the user wants to appprove the funds to preorder the product
            const product = await preorderNFTContract.methods.products(productId).call();
            let price = product.price;
            console.log("price: ", price);
            // TODO: Need to let the user pick which currency they want to pay with (so long as it is accepted and active for the product)
            const acceptable = await preorderNFTContract.methods.isCurrencyAcceptable(stablecoinProxyAddress).call();
            console.log("acceptable: ", acceptable);
            const active = await preorderNFTContract.methods.isCurrencyActive(stablecoinProxyAddress).call();
            console.log("active: ", active);
            const productCurrencies = await preorderNFTContract.methods.getProductCurrencies(productId).call();
            console.log("productCurrencies: ", productCurrencies);
            // const acceptableForProduct = await preorderNFTContract.methods.isCurrencyAcceptableForProduct(productId, stablecoinProxyAddress).call();
            // const acceptableForProduct = await preorderNFTContract.methods.isCurrencyAcceptableForProduct(productId, productCurrencies[0]).call();
            // console.log("acceptableForProduct: ", acceptableForProduct);
            let acceptableForProduct = true;
            if (acceptable && active && acceptableForProduct) {
                const allow = await stablecoinContract.methods.approve(preorderNFTProxyAddress, price).send({ from: userAddress });
                console.log("allow: ", allow);
                const allowance = await stablecoinContract.methods.allowance(userAddress, preorderNFTProxyAddress).call();
                console.log("allowance: ", allowance);
                console.log("productId: ", productId);
                const resp = await preorderNFTContract.methods.purchasePreorder(stablecoinProxyAddress, productId).send({ from: userAddress });
                console.log("resp: ", resp);
            }
        } catch (error) {
            console.error("error: ", error);
        }
	}

    async function redeemNFT(i) {
        // i is the index for the product in the products array to redeem
        try {
            const userAddress = await getUserAddress();
            const list = await preorderNFTContract.methods.getNFTsByOwner(userAddress).call();
            console.log("list: ", list);
            const NFTid = await preorderNFTContract.methods.checkNFTOwnershipBySku(userAddress, products[i].name).call();
            console.log("NFTid: ", NFTid);
            if (NFTid == 0) {
                console.log("NFT for this product is not owned by this user!");
                return;
            }
            console.log("Redeeming");
            const resp = await preorderNFTContract.methods.redeemPreorder(NFTid).send({from: userAddress});
        } catch (error) {
            console.error("error: ", error);
        }
	}

</script>

<!-- BEGIN #content -->
<div id="content" class="app-content p-0">
    <!-- BEGIN d-flex -->
    <div class="d-block d-md-flex align-items-stretch h-100">
        <!-- <PageMenu>
            <div class="gallery-menu-header">Main</div>
            <div class="gallery-menu-item"><a href="#" class="gallery-menu-link active"><i class="fa fa-fw fa-image me-1"></i> Photos</a></div>
            <div class="gallery-menu-item"><a href="#" class="gallery-menu-link"><i class="fa fa-fw fa-heart me-1"></i> Memories</a></div>
            <div class="gallery-menu-header">Shared</div>
            <div class="gallery-menu-item"><a href="#" class="gallery-menu-link"><i class="fa fa-fw fa-cloud me-1"></i> Activity</a></div>
            <div class="gallery-menu-header">Albums</div>
            <div class="gallery-menu-item"><a href="#" class="gallery-menu-link"><i class="fa fa-fw fa-camera me-1"></i> All Photos</a></div>
            <div class="gallery-menu-item"><a href="#" class="gallery-menu-link"><i class="fa fa-fw fa-user me-1"></i> People</a></div>
            <div class="gallery-menu-item"><a href="#" class="gallery-menu-link"><i class="fa fa-fw fa-map-pin me-1"></i> Places</a></div>
            <div class="gallery-menu-item"><a href="#" class="gallery-menu-link"><i class="fa fa-fw fa-camera-retro me-1"></i> Selfies</a></div>
            <div class="gallery-menu-item"><a href="#" class="gallery-menu-link"><i class="fa fa-fw fa-video me-1"></i> Panaromas</a></div>
            <div class="gallery-menu-item"><a href="#" class="gallery-menu-link"><i class="fa fa-fw fa-star me-1"></i> Depth Effect</a></div>
            <div class="gallery-menu-item"><a href="#" class="gallery-menu-link"><i class="fa fa-fw fa-mobile me-1"></i> Screenshots</a></div>
        </PageMenu> -->
        <!-- BEGIN gallery-content-container -->
        <div class="gallery-content-container">
            <!-- BEGIN scrollbar -->
            <div data-scrollbar="true" data-height="100%">
                <!-- BEGIN gallery-content -->
                <div class="gallery-content">
                    <!-- <ProductsGrid name="Fall/Winter 2022" date="October 12, 2022"> -->
                    <div class="row">
                        {#each products as product, i}<div class="col-sm-6 col-md-4 col-lg-3">
                            <div class="box">
                                <div class="option_container">
                                    <div class="options">
                                        <!-- {#if addProductsPage}
                                            <a href="#!" class="option1" on:mousedown={() => postProduct(i)}> List as NFT </a>
                                        {:else if buyProductsPage}
                                            <a href="#!" class="option1" on:mousedown={() => getProductId(i)}> Preorder NFT </a>
                                            <a href="#!" class="option3" on:mousedown={() => redeemNFT(i)}> Redeem NFT </a>
                                        {:else if fundProductsPage}
                                            <a href="#!" class="option1" on:mousedown={() => redeemNFT(i)}> Fund NFT </a>
                                        {/if} -->
                                        <!-- <a href="#!" class="option2" on:mousedown={() => {console.log("CLICKED: ", i)}}> Preorder NFT </a> -->
                                        <!-- <Button type="secondary" on:click={() => preorder(i)}> Preorder NFT </Button> -->
                                        <!-- <Button type="secondary" on:click={() => {console.log("CLICKED: ", i)}}> Preorder NFT </Button> -->
                                    </div>
                                </div>
                                <div class="img-box">
                                    <img src={product.img} alt="" />
                                </div>
                                <div>
                                    <h5>{product.name}</h5>
                                        <h6>${parseInt(product.price)/4}</h6>
                                        <h6>Preorders: {product.preorderCount}</h6>
                                        <h6>${product.price}</h6>
                                </div>
                            </div>
                        </div>
                        <!-- <li><a href={product.img} style="align-items: unset; background: none;" itemprop="contentUrl" data-size="752x502"><img src={product.img} itemprop="thumbnail" alt="image {i}" class="img-product" /></a></li> -->
                        {/each}
                    </div>
                    <!-- </ProductsGrid> -->
                    <ProductsGrid name="Wedding" date="May 11, 2022">
                        <li><a href="/assets/img/gallery/gallery-42.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-42.jpg" itemprop="thumbnail" alt="Wedding Image 1" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-43.jpg" itemprop="contentUrl" data-size="752x442"><img src="/assets/img/gallery/gallery-43.jpg" itemprop="thumbnail" alt="Wedding Image 2" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-44.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-44.jpg" itemprop="thumbnail" alt="Wedding Image 3" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-45.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-45.jpg" itemprop="thumbnail" alt="Wedding Image 4" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-46.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-46.jpg" itemprop="thumbnail" alt="Wedding Image 5" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-47.jpg" itemprop="contentUrl" data-size="752x532"><img src="/assets/img/gallery/gallery-47.jpg" itemprop="thumbnail" alt="Wedding Image 6" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-48.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-48.jpg" itemprop="thumbnail" alt="Wedding Image 7" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-49.jpg" itemprop="contentUrl" data-size="752x1130"><img src="/assets/img/gallery/gallery-49.jpg" itemprop="thumbnail" alt="Wedding Image 8" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-50.jpg" itemprop="contentUrl" data-size="752x1128"><img src="/assets/img/gallery/gallery-50.jpg" itemprop="thumbnail" alt="Wedding Image 9" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-51.jpg" itemprop="contentUrl" data-size="752x866"><img src="/assets/img/gallery/gallery-51.jpg" itemprop="thumbnail" alt="Wedding Image 10" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-52.jpg" itemprop="contentUrl" data-size="752x752"><img src="/assets/img/gallery/gallery-52.jpg" itemprop="thumbnail" alt="Wedding Image 11" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-53.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-53.jpg" itemprop="thumbnail" alt="Wedding Image 12" class="img-portrait" /></a></li>
                    </ProductsGrid>
                    <ProductsGrid name="Collections #339" date="May 8, 2022">
                        <li><a href="/assets/img/gallery/gallery-21.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-21.jpg" itemprop="thumbnail" alt="Collection #145 Image 1" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-22.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-22.jpg" itemprop="thumbnail" alt="Collection #145 Image 2" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-23.jpg" itemprop="contentUrl" data-size="752x486"><img src="/assets/img/gallery/gallery-23.jpg" itemprop="thumbnail" alt="Collection #145 Image 3" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-24.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-24.jpg" itemprop="thumbnail" alt="Collection #145 Image 4" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-25.jpg" itemprop="contentUrl" data-size="752x1128"><img src="/assets/img/gallery/gallery-25.jpg" itemprop="thumbnail" alt="Collection #145 Image 5" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-26.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-26.jpg" itemprop="thumbnail" alt="Collection #145 Image 6" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-27.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-27.jpg" itemprop="thumbnail" alt="Collection #145 Image 7" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-28.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-28.jpg" itemprop="thumbnail" alt="Collection #145 Image 8" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-29.jpg" itemprop="contentUrl" data-size="752x1128"><img src="/assets/img/gallery/gallery-29.jpg" itemprop="thumbnail" alt="Collection #145 Image 9" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-30.jpg" itemprop="contentUrl" data-size="752x940"><img src="/assets/img/gallery/gallery-30.jpg" itemprop="thumbnail" alt="Collection #145 Image 10" /></a></li>
                    </ProductsGrid>
                    <ProductsGrid name="Collections #144" date="May 4, 2022">
                        <li><a href="/assets/img/gallery/gallery-31.jpg" itemprop="contentUrl" data-size="752x752"><img src="/assets/img/gallery/gallery-31.jpg" itemprop="thumbnail" alt="Collection #144 Image 1" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-32.jpg" itemprop="contentUrl" data-size="752x1128"><img src="/assets/img/gallery/gallery-32.jpg" itemprop="thumbnail" class="img-portrait" alt="Collection #144 Image 2" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-33.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-33.jpg" itemprop="thumbnail" alt="Collection #144 Image 3" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-34.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-34.jpg" itemprop="thumbnail" alt="Collection #144 Image 4" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-35.jpg" itemprop="contentUrl" data-size="752x1136"><img src="/assets/img/gallery/gallery-35.jpg" itemprop="thumbnail" alt="Collection #144 Image 5" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-36.jpg" itemprop="contentUrl" data-size="752x1128"><img src="/assets/img/gallery/gallery-36.jpg" itemprop="thumbnail" alt="Collection #144 Image 6" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-37.jpg" itemprop="contentUrl" data-size="752x480"><img src="/assets/img/gallery/gallery-37.jpg" itemprop="thumbnail" alt="Collection #144 Image 7" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-38.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-38.jpg" itemprop="thumbnail" alt="Collection #144 Image 8" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-39.jpg" itemprop="contentUrl" data-size="752x422"><img src="/assets/img/gallery/gallery-39.jpg" itemprop="thumbnail" alt="Collection #144 Image 9" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-40.jpg" itemprop="contentUrl" data-size="752x464"><img src="/assets/img/gallery/gallery-40.jpg" itemprop="thumbnail" alt="Collection #144 Image 10" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-41.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-41.jpg" itemprop="thumbnail" alt="Collection #144 Image 11" class="img-portrait" /></a></li>
                    </ProductsGrid>
                    <ProductsGrid name="Collections #143" date="May 3, 2022">
                        <li><a href="/assets/img/gallery/gallery-1.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-1.jpg" itemprop="thumbnail" alt="Collection #143 Image 1" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-2.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-2.jpg" itemprop="thumbnail" alt="Collection #143 Image 2" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-3.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-3.jpg" itemprop="thumbnail" alt="Collection #143 Image 3" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-4.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-4.jpg" itemprop="thumbnail" alt="Collection #143 Image 4" /></a></li>
                    </ProductsGrid>
                    <ProductsGrid name="Random" date="May 1, 2022">
                        <li><a href="/assets/img/gallery/gallery-5.jpg" itemprop="contentUrl" data-size="752x500"><img src="/assets/img/gallery/gallery-5.jpg" itemprop="thumbnail" alt="Random Image 1" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-6.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-6.jpg" itemprop="thumbnail" alt="Random Image 2" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-7.jpg" itemprop="contentUrl" data-size="752x476"><img src="/assets/img/gallery/gallery-7.jpg" itemprop="thumbnail" alt="Random Image 3" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-8.jpg" itemprop="contentUrl" data-size="752x472"><img src="/assets/img/gallery/gallery-8.jpg" itemprop="thumbnail" alt="Random Image 4" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-9.jpg" itemprop="contentUrl" data-size="752x504"><img src="/assets/img/gallery/gallery-9.jpg" itemprop="thumbnail" alt="Random Image 5" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-10.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-10.jpg" itemprop="thumbnail" alt="Random Image 6" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-11.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-11.jpg" itemprop="thumbnail" alt="Random Image 7" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-12.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-12.jpg" itemprop="thumbnail" alt="Random Image 8" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-13.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-13.jpg" itemprop="thumbnail" alt="Random Image 9" class="img-portrait" /></a></li>
                    </ProductsGrid>
                </div>
                <!-- END gallery-content -->
            </div>
            <!-- END scrollbar -->
        </div>
        <!-- END gallery-content-container -->
    </div>
    <!-- END d-flex -->
</div>
<!-- END #content -->
	