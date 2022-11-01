<script>
    import Head from "$lib/head.svelte";
    import Header from "$lib/header.svelte";
    import ShoppingCart from "$lib/shoppingcart.svelte";
    import Themes from "$lib/themes.svelte";
    import Photoswipe from "$lib/photoswipe.svelte";
    import { page } from '$app/stores';
    
    
    import { browser } from '$app/env';

    let appdiv;
    let search = false;
    let sidebar = true;
    let menus = true;
    let gallery = false;

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

    if (browser) {
        onMount(async () => {
            if (browser) {
                appdiv = document.getElementById('app');
            }
        });
    }
</script>

<Head title="Addavox" />   

<!-- BEGIN #app -->
<div id="app" class="app {(gallery) ? 'app-content-full-height' : ''}" 
    class:app-header-menu-search-toggled={search}>
    <Header {sidebar} {menus} bind:search={search} on:toggleSidebar={(e) => handleSidebarEvent(e)} />
    {#if menus}
        <ShoppingCart />
    {/if}
    <!-- BEGIN mobile-sidebar-backdrop -->
    <button class="app-sidebar-mobile-backdrop" on:click={() => showSidebar(true)}></button>
    <!-- END mobile-sidebar-backdrop -->
    <slot />
    <!-- BEGIN btn-scroll-top -->
    <a href="#top" data-toggle="scroll-to-top" class="btn-scroll-top fade"><i class="fa fa-arrow-up"></i></a>
    <!-- END btn-scroll-top -->
    <Themes />
</div>
<!-- END #app -->

{#if gallery} <Photoswipe /> {/if}