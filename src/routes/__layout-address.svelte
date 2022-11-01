<script>
    import Head from "$lib/head.svelte";
    import Header from "$lib/header.svelte";
    import AddressSidebar from "$lib/addressSidebar.svelte";
    import Themes from "$lib/themes.svelte";
    import Photoswipe from "$lib/photoswipe.svelte";
    import { page } from '$app/stores';
    import { web3js, contracts, ABIs } from '../stores'
    import { onMount } from 'svelte';
    import { browser } from '$app/env';

    import ProductFactory from '../truffle/build/contracts/ProductPostable.json';
    import PreorderNFT from '../truffle/build/contracts/PreorderNFT.json';
    import Stablecoin from '../truffle/build/contracts/Stablecoin.json';

    let appdiv;
    let search = false;
    let sidebar = true;
    let menus = true;
    let gallery = false;
    let address;

    // let web3js;
    // let contracts = [];
    let preorderNFTProxyAddress;
    let productFactoryProxyAddress;
    let stablecoinProxyAddress;
    let preorderNFTContract;
    let productFactoryContract;
    let stablecoinContract;

    function toggleSidebar() {
        sidebar = !sidebar;
    }

    function handleSidebarEvent(e) {
        sidebar = e.detail.show;
        showSidebar(sidebar);
    }

    function showSidebar(show) {
        if (browser && appdiv) {
            if (show) {
                appdiv.classList.add('app-sidebar-toggled');
                appdiv.classList.remove('app-sidebar-collapsed');
            } else {
                appdiv.classList.add('app-sidebar-collapsed');
                appdiv.classList.remove('app-sidebar-toggled');
            }
        }
    }

    $: pageChanged($page);

    function pageChanged(route) {
        // Reset
        gallery = false;
        menus = true;
        // Test
        if (route) {
            let path = route.routeId;
            if (path) {
                if (path.indexOf('projects') > -1) gallery = true;
                if (path === ('/') || path === '') menus = false;
                if (path.indexOf('login') > -1) menus = false;
                if (path.indexOf('register') > -1) menus = false;
            } else {
                menus = false; // index page just loaded
            }
        } 
    }

    onMount(async () => {
        console.log("page: ", page);
        if (browser) {
            appdiv = document.getElementById('app');
        }
        preorderNFTProxyAddress = import.meta.env.VITE_PREORDER_NFT_PROXY_ADDRESS;
        productFactoryProxyAddress = import.meta.env.VITE_PRODUCT_FACTORY_PROXY_ADDRESS;
        stablecoinProxyAddress = import.meta.env.VITE_STABLECOIN_PROXY_ADDRESS;
        web3js.set(new Web3(ethereum));
        console.log("web3js: ", $web3js);
        const newABIs = { "productFactoryABI": ProductFactory.abi, "preorderABI": PreorderNFT.abi, "tokenABI": Stablecoin.abi}
        ABIs.set(newABIs);
        console.log("$ABIs: ", $ABIs);
        preorderNFTContract = new $web3js.eth.Contract(PreorderNFT.abi, preorderNFTProxyAddress);
        productFactoryContract = new $web3js.eth.Contract(ProductFactory.abi, productFactoryProxyAddress);
        stablecoinContract = new $web3js.eth.Contract(Stablecoin.abi, stablecoinProxyAddress);
        console.log("preorderNFTContract: ", preorderNFTContract);
        console.log("productFactoryContract: ", productFactoryContract);
        console.log("stablecoinContract: ", stablecoinContract);
        
        let array = [];
        const preorderContract = preorderNFTContract;
        const productContract = productFactoryContract;
        const tokenContract = stablecoinContract;
        let contractObj = { preorderContract, productContract, tokenContract };
        contracts.set(contractObj);
        console.log("$contracts: ", $contracts);
    });
    
</script>

<Head title="Addavox" />   

<!-- BEGIN #app -->
<div id="app" class="app {(gallery) ? 'app-content-full-height' : ''}" 
    class:app-header-menu-search-toggled={search}>
    <Header {sidebar} admin={true} {menus} bind:search={search} on:toggleSidebar={(e) => handleSidebarEvent(e)} />
    {#if menus}
        <AddressSidebar/>
    {/if}
    <!-- BEGIN mobile-sidebar-backdrop -->
    <button class="app-sidebar-mobile-backdrop" on:click={() => showSidebar(true)}></button>
    <!-- END mobile-sidebar-backdrop -->
    <slot/>
    <!-- BEGIN btn-scroll-top -->
    <a href="#top" data-toggle="scroll-to-top" class="btn-scroll-top fade"><i class="fa fa-arrow-up"></i></a>
    <!-- END btn-scroll-top -->
    <Themes />
</div>
<!-- END #app -->

{#if gallery} <Photoswipe /> {/if}