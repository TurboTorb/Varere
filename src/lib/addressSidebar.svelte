<!-- <script context="module">
    export async function load({ fetch, params }) {
        console.log("params: ", params);
        const address = params.id;
        // const res = await fetch(`/accounts/${id}.json`);
        // const { address } = await res.json();
        console.log("addressssss: ", address);

        // if (res.ok) {
            return {
                props: {
                    address
                }
            }
        // }
        // return {
        //     status: 301,
        //     redirect: '/address'
        // }
    }
</script> -->

<script>
    // import PageMenu from "$lib/page-menu.svelte";
    import GalleryGroup from "$lib/gallery-group.svelte";
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    import { page } from '$app/stores';

    let scripts = [
	    "/assets/js/demo/page-gallery.demo.js"
    ];

    let app;
    let scrollbar;
    let showProjects = false;
    // let projects = [
    //     {id: 1, label: "Project 1"},
    //     {id: 2, label: "Project 2"},
    //     {id: 3, label: "Project 3"},
    //     {id: 4, label: "Project 4"},
    //     {id: 5, label: "Project 5"}
    // ];

    function toggleProjects() {
        showProjects = !showProjects;
    }

    function saveCurrentPosition() {
        localStorage.setItem(app.sidebar.scrollBar.localStorage, scrollbar.scrollTop);
    }

    if (browser) {
        onMount(async () => {
            if (typeof window !== 'undefined') {
                app = window['app'];
                var defaultScroll = localStorage.getItem(app.sidebar.scrollBar.localStorage);
				if (defaultScroll) {
                    scrollbar.srollTop =  defaultScroll;
                }
            }
        });
    }
</script>

<!-- BEGIN #sidebar -->
<div id="sidebar" class="app-sidebar">
    <!-- BEGIN scrollbar -->
    <div class="app-sidebar-content pb-4 overflow-auto" bind:this={scrollbar} on:scroll={saveCurrentPosition} data-scrollbar="true" data-height="100%">
        <!-- BEGIN menu -->
        <div class="menu">
            <div class="menu-header">User Statistics</div>
            <div class="menu-item">
                <a href="/address/{$page && $page.params.address ? $page.params.address : ""}/store" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-inbox"></i></span>
                    <span class="menu-text">Store</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/address/{$page && $page.params.address ? $page.params.address : ""}/affiliate" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-tags"></i></span>
                    <span class="menu-text">Affiliate</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/address/{$page && $page.params.address ? $page.params.address : ""}/funder" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-file-code"></i></span>
                    <span class="menu-text">Funder</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/address/{$page && $page.params.address ? $page.params.address : ""}/customer" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-users"></i></span>
                    <span class="menu-text">Customer</span>
                </a>
            </div>
            <!-- <div class="menu-item">
                <a href="/admin/funding" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-wallet"></i></span>
                    <span class="menu-text">Funding</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin/staking" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-vault"></i></span>
                    <span class="menu-text">Staking</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin/swapping" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-right-left"></i></span>
                    <span class="menu-text">Swapping</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin/withdrawals" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-money-bill-wave"></i></span>
                    <span class="menu-text">Withdrawals</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-cpu"></i></span>
                    <span class="menu-text">Processes</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin/analytics" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-bar-chart"></i></span>
                    <span class="menu-text">Analytics</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin/ship" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-truck-fast"></i></span>
                    <span class="menu-text">Ship</span>
                </a>
            </div>
            <div class="menu-header">Projects</div>
            <div class="menu-item">
                <a href="/projects" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-images"></i></span>
                    <span class="menu-text">Board</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/projects/manage" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-sliders"></i></span>
                    <span class="menu-text">Manage</span>
                </a>
            </div>
            <div class="menu-item has-sub {(showProjects) ? 'expand' : ''}">
                <a href="#projects"on:click={(e) => toggleProjects()} class="menu-link">
                    <span class="menu-icon">
                        <i class="bi bi-collection"></i>
                    </span>
                    <span class="menu-text">Most Recent</span>
                    <span class="menu-caret"><b class="caret"></b></span>
                </a>
                <div class="menu-submenu {(showProjects) ? 'd-block' : 'd-none'}">
                    {#each projects as project }
                        <div class="menu-item">
                            <a href="/projects/{project.id}" class="menu-link">
                                <span class="menu-text">{project.label}</span>
                            </a>
                        </div>
                    {/each}
                </div>
            </div> -->
            <!-- <div class="menu-header">Application Mode</div>
            <div class="menu-item">
                <a href="/app#scribe" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-closed-captioning"></i></span>
                    <span class="menu-text">Scribe</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/app#mimic" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-microphone"></i></span>
                    <span class="menu-text">Mimic</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/app#sync" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-eye"></i></span>
                    <span class="menu-text">Sync</span>
                </a>
            </div> -->
            <div class="menu-divider"></div>
            <div class="menu-header">Profile</div>
            <div class="menu-item">
                <a href="/admin/profile" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-people"></i></span>
                    <span class="menu-text">Profile</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin/store" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-shop"></i></span>
                    <span class="menu-text">Store</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin/settings" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-gear"></i></span>
                    <span class="menu-text">Settings</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin/help" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-gem"></i></span>
                    <span class="menu-text">Help</span>
                </a>
            </div>
        </div>
        <!-- END menu -->
        <!-- <div class="p-3 px-4 mt-auto">
            <a href="/documentation" class="btn d-block btn-outline-theme">
                <i class="fa fa-code-branch me-2 ms-n2 opacity-5"></i> Documentation
            </a>
        </div> -->
    </div>
    <!-- END scrollbar -->
</div>
<!-- END #sidebar -->