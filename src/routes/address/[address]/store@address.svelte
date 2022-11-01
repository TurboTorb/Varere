<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    import { page } from '$app/stores';
    import Utils from '$lib/utils.js';
    import { web3js, contracts, ABIs } from '../../../stores';
    
    let address = $page.params.address

    let scripts = [
	    "/assets/js/demo/page-gallery.demo.js"
    ];

    if (browser) {
        onMount(async () => {
            console.log("$page: ", $page);
            scripts.forEach((url) => {
                const script = document.createElement('script');
                script.src = url;
                document.body.append(script);
            });

            getProducts();
        });
    }

    async function getProducts() {
        const userAddress = await Utils.getUserAddress();
        if (!userAddress) return;
        try {
            const productCount = await $contracts.productContract.methods.getStoreProductCount(address).call();
            console.log("productCount: ", productCount);
            let products = [];
            for (let i = 1; i <= productCount; i++) {
                const product = await $contracts.productContract.methods.getStoreProduct(address, i).call();
                products.push(product);
            }
            console.log("products: ", products);
        } catch (error) {
            console.log("error: ", error);
        }
    }

</script>

<div class="login">
	<!-- BEGIN login-content -->
	<div class="login-content">
        This is where we will show all the Stores sales and product statistics {address}
    </div>
</div>