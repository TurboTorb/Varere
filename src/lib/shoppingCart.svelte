<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/env';

    let app;
    let scrollbar;

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
    <div class="app-sidebar-content" bind:this={scrollbar} on:scroll={saveCurrentPosition} data-scrollbar="true" data-height="100%">
        <!-- BEGIN menu -->
        <!-- <div class="menu">
            <div class="menu-header">Dashboard</div>
            <div class="menu-item">
                <a href="/dashboard" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-cpu"></i></span>
                    <span class="menu-text">Processes</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/dashboard/analytics" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-bar-chart"></i></span>
                    <span class="menu-text">Analytics</span>
                </a>
            </div>
            <div class="menu-header">Projects</div>
            <div class="menu-item">
                <a href="/projects" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-images"></i></span>
                    <span class="menu-text">Gallery</span>
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
            </div>
            <div class="menu-header">Application Mode</div>
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
            </div>
            <div class="menu-divider"></div>
            <div class="menu-header">Users</div>
            <div class="menu-item">
                <a href="/user" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-people"></i></span>
                    <span class="menu-text">Profile</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/user/settings" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-gear"></i></span>
                    <span class="menu-text">Settings</span>
                </a>
            </div>
            <div class="menu-item">
                <a href="/help" class="menu-link">
                    <span class="menu-icon"><i class="bi bi-gem"></i></span>
                    <span class="menu-text">Help</span>
                </a>
            </div>
        </div> -->
        <div class="table-responsive">
            <table class="w-100 mb-0 small align-middle text-nowrap">
                <tbody>
                    <tr>
                        <td>
                            <div class="d-flex">
                                <div class="position-relative mb-2">
                                    <div class="bg-center bg-cover bg-no-repeat w-80px h-60px" style="background-image: url(/assets/img/dashboard/product-1.jpeg);">
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
                        <!-- <td>
                            <table class="mb-2">
                                <tr>
                                    <td class="pe-3">QTY:</td>
                                    <td class="text-white text-opacity-75 fw-500">129</td>
                                </tr>
                                <tr>
                                    <td class="pe-3">REVENUE:</td>
                                    <td class="text-white text-opacity-75 fw-500">$51,471</td>
                                </tr>
                                <tr>
                                    <td class="pe-3 text-nowrap">PROFIT:</td>
                                    <td class="text-white text-opacity-75 fw-500">$15,441</td>
                                </tr>
                            </table>
                        </td> -->
                        <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a></td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex mb-2 align-items-center">
                                <div class="position-relative">
                                    <div class="bg-center bg-cover bg-no-repeat w-80px h-60px" style="background-image: url(/assets/img/dashboard/product-2.jpeg);">
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
                        <!-- <td>
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
                        </td> -->
                        <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a></td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex mb-2 align-items-center">
                                <div class="position-relative">
                                    <div class="bg-center bg-cover bg-no-repeat w-80px h-60px" style="background-image: url(/assets/img/dashboard/product-3.jpeg);">
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
                        <!-- <td>
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
                        </td> -->
                        <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a></td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex mb-2 align-items-center">
                                <div class="position-relative">
                                    <div class="bg-center bg-cover bg-no-repeat w-80px h-60px" style="background-image: url(/assets/img/dashboard/product-4.jpeg);">
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
                        <!-- <td>
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
                        </td> -->
                        <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a></td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="position-relative">
                                    <div class="bg-center bg-cover bg-no-repeat w-80px h-60px" style="background-image: url(/assets/img/dashboard/product-5.jpeg);">
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
                        <!-- <td>
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
                        </td> -->
                        <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a></td>
                    </tr>
                </tbody>
            </table>
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