<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/env';
    import { project, mode } from '../scribe.js';
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';

    export let projects;
    let recent = [];

    let app;
    let scrollbar;
    let showProjects = false;

    function toggleProjects() {
        showProjects = !showProjects;
    }

    function saveCurrentPosition() {
        localStorage.setItem(app.sidebar.scrollBar.localStorage, scrollbar.scrollTop);
    }

    function setProject(proj) {
        project.set(proj);
        goto('/scribe');
    }

    if (browser) {
        onMount(async () => {
            if (typeof window !== 'undefined') {
                app = window['app'];
                let defaultScroll = localStorage.getItem(app.sidebar.scrollBar.localStorage);
				if (defaultScroll) {
                    scrollbar.srollTop =  defaultScroll;
                }
            }
            recent = projects.slice(-10);
        });
    }
</script>

<style>
    .selected-link {
        text-decoration: none;
        color: #fff;
        position: relative;
        padding: .5rem 1rem;
        display: flex;
        align-items: center;
        padding: 0.3rem 1rem;
    }

    .selected-link > .menu-icon {
        width: 1.875rem;
        height: 1.875rem;
        font-size: 1.05rem;
        margin: -0.25rem 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.75rem;
    }
</style>

<!-- BEGIN #sidebar -->
<div id="sidebar" class="app-sidebar">
    <!-- BEGIN scrollbar -->
    <div class="app-sidebar-content pb-4 overflow-auto" bind:this={scrollbar} on:scroll={saveCurrentPosition} data-scrollbar="true" data-height="100%">
        <!-- BEGIN menu -->
        <div class="menu">
            <div class="menu-header">Dashboard</div>
            <div class="menu-item">
                <a href="/admin/orders" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-inbox"></i></span>
                    <span class="menu-text">Orders</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin/products" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-tags"></i></span>
                    <span class="menu-text">Products</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin/contracts" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-file-code"></i></span>
                    <span class="menu-text">Contracts</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/admin/customers" class="menu-link">
                    <span class="menu-icon"><i class="fas fa-users"></i></span>
                    <span class="menu-text">Customers</span>
                </a>
            </div>
            <div class="menu-item">
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
                <a href="/projects" class="{($page.url.pathname == '/projects') ? 'selected-link' : 'menu-link'}">
                    <span class="menu-icon"><i class="bi bi-images"></i></span>
                    <span class="menu-text">Board</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/projects/manage" class="{($page.url.pathname == '/projects/manage') ? 'selected-link' : 'menu-link'}">
                    <span class="menu-icon"><i class="bi bi-sliders"></i></span>
                    <span class="menu-text">Manage</span>
                </a>
            </div>
            <!-- <div class="menu-item has-sub {(showProjects) ? 'expand' : ''}">
                <a href="#projects"on:click={(e) => toggleProjects()} class="menu-link">
                    <span class="menu-icon">
                        <i class="bi bi-collection"></i>
                    </span>
                    <span class="menu-text">Most Recent</span>
                    <span class="menu-caret"><b class="caret"></b></span>
                </a>
                <div class="menu-submenu {(showProjects) ? 'd-block' : 'd-none'}">
                    {#each recent as proj }
                        <div class="menu-item">
                            <!-- <a href="/projects/{project.id}" class="menu-link"> -->
                            <a href="#{proj.id}" on:click={(e) => setProject(proj)} class="menu-link">
                                <span class="menu-text">{proj.label}</span>
                            </a>
                        </div>
                    {/each}
                </div>
            </div> -->
            <!-- <div class="menu-header">Application Mode</div>
            <div class="menu-item">
                <a href="/scribe#transcribe" class="{($page.url.pathname == '/scribe' && $mode == 0) ? 'selected-link' : 'menu-link'}">
                    <span class="menu-icon"><i class="fas fa-feather-alt"></i></span>
                    <span class="menu-text">Transcribe</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/scribe#translate" class="{($page.url.pathname == '/scribe' && $mode == 1) ? 'selected-link' : 'menu-link'}">
                    <span class="menu-icon"><i class="fas fa-language"></i></span>
                    <span class="menu-text">Translate</span>
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