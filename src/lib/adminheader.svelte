<script>
    export let menus = true;
    export let sidebar = true;
    export let search = false;
    import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    function sidebarToggle() {
        sidebar = !sidebar;
        dispatch('toggleSidebar', {
			show: sidebar
		});
    }

    function showSearch(show) {
        search = show;
    }
</script>

<style>
    .hide {
        position: absolute;
        top: -60px;
        transition: position 0.5s;
    }
</style>

<!-- BEGIN #header -->
<div id="header" class="app-header {(!menus) ? 'hide' : ''}">
    <!-- BEGIN desktop-toggler -->
    <div class="desktop-toggler">
        <button type="button" on:click={() => sidebarToggle()} class="menu-toggler" data-toggle-class="app-sidebar-collapsed" data-dismiss-class="app-sidebar-toggled" data-toggle-target=".app">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
    </div>
    <!-- BEGIN desktop-toggler -->
    
    <!-- BEGIN mobile-toggler -->
    <div class="mobile-toggler">
        <button type="button" on:click={() => sidebarToggle()} class="menu-toggler" data-toggle-class="app-sidebar-mobile-toggled" data-toggle-target=".app">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
    </div>
    <!-- END mobile-toggler -->
    <!-- BEGIN brand -->
    <div class="brand">
        <a href="/projects" class="brand-logo">
            <span class="brand-img">
                <span class="brand-img-text text-theme">d</span>
            </span>
            <span class="brand-text">COMMERCE</span>
        </a>
    </div>
    <!-- END brand -->

    <!-- BEGIN menu -->
    <div class="menu">
        <div class="menu-item dropdown">
            <a href="#search" on:click={() => showSearch(true)} class="menu-link">
                <div class="menu-icon"><i class="bi bi-search nav-icon"></i></div>
            </a>
        </div>
        <div class="menu-item dropdown dropdown-mobile-full">
            <a href="#apps" data-bs-toggle="dropdown" data-bs-display="static" class="menu-link">
                <div class="menu-icon"><i class="bi bi-grid-3x3-gap nav-icon"></i></div>
            </a>
            <div class="dropdown-menu fade dropdown-menu-end w-300px text-center p-0 mt-1">
                <div class="row row-grid gx-0">
                    <div class="col-4">
                        <a href="/shop" class="dropdown-item text-decoration-none p-3 bg-none">
                            <div class="position-relative">
                                <i class="bi bi-circle-fill position-absolute text-theme top-0 mt-n2 me-n2 fs-6px d-block text-center w-100"></i>
                                <i class="fas fa-bag-shopping h2 opacity-5 d-block my-1"></i>
                            </div>
                            <div class="fw-500 fs-10px text-white">SHOP</div>
                        </a>
                    </div>
                    <div class="col-4">
                        <a href="/app#mimic" class="dropdown-item text-decoration-none p-3 bg-none">
                            <div><i class="fas fa-money-bill-wave h2 opacity-5 d-block my-1"></i></div>
                            <div class="fw-500 fs-10px text-white">FUND</div>
                        </a>
                    </div>
                    <div class="col-4">
                        <a href="/app#sync" class="dropdown-item text-decoration-none p-3 bg-none">
                            <div><i class="fas fa-arrow-right-arrow-left h2 opacity-5 d-block my-1"></i></div>
                            <div class="fw-500 fs-10px text-white">SWAP</div>
                        </a>
                    </div>
                </div>
                <div class="row row-grid gx-0">
                    <div class="col-4">
                        <a href="/admin/analytics" class="dropdown-item text-decoration-none p-3 bg-none">
                            <div><i class="fas fa-vault h2 opacity-5 d-block my-1"></i></div>
                            <div class="fw-500 fs-10px text-white">STAKE</div>
                        </a>
                    </div>
                    <div class="col-4">
                        <a href="/projects" class="dropdown-item text-decoration-none p-3 bg-none">
                            <div class="position-relative">
                                <i class="bi bi-circle-fill position-absolute text-theme top-0 mt-n2 me-n2 fs-6px d-block text-center w-100"></i>
                                <i class="fa-solid fa-coins h2 opacity-5 d-block my-1"></i>
                                <!-- This NFT icon is cool, but its not free -->
                                <!-- <i class="fas fa-hexagon-vertical-nft-slanted h2 opacity-5 d-block my-1"></i> -->
                            </div>
                            <div class="fw-500 fs-10px text-white">NFTs</div>
                        </a>
                    </div>
                    <div class="col-4">
                        <a href="/projects/manage" class="dropdown-item text-decoration-none p-3 bg-none">
                            <div><i class="fas fa-list-ul h2 opacity-5 d-block my-1"></i></div>
                            <div class="fw-500 fs-10px text-white">ORDERS</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="menu-item dropdown dropdown-mobile-full">
            <a href="#" data-bs-toggle="dropdown" data-bs-display="static" class="menu-link">
                <div class="menu-icon"><i class="bi bi-bell nav-icon"></i></div>
                <div class="menu-badge bg-theme"></div>
            </a>
            <div class="dropdown-menu dropdown-menu-end mt-1 w-300px fs-11px pt-1">
                <h6 class="dropdown-header fs-10px mb-1">NOTIFICATIONS</h6>
                <div class="dropdown-divider mt-1"></div>
                <a href="#" class="d-flex align-items-center py-10px dropdown-item text-wrap">
                    <div class="fs-20px">
                        <i class="bi bi-bag text-theme"></i>
                    </div>
                    <div class="flex-1 flex-wrap ps-3">
                        <div class="mb-1 text-white">NEW ORDER RECEIVED ($1,299)</div>
                        <div class="small">JUST NOW</div>
                    </div>
                    <div class="ps-2 fs-16px">
                        <i class="bi bi-chevron-right"></i>
                    </div>
                </a>
                <a href="#" class="d-flex align-items-center py-10px dropdown-item text-wrap">
                    <div class="fs-20px w-20px">
                        <i class="bi bi-person-circle text-theme"></i>
                    </div>
                    <div class="flex-1 flex-wrap ps-3">
                        <div class="mb-1 text-white">3 NEW ACCOUNT CREATED</div>
                        <div class="small">2 MINUTES AGO</div>
                    </div>
                    <div class="ps-2 fs-16px">
                        <i class="bi bi-chevron-right"></i>
                    </div>
                </a>
                <a href="#" class="d-flex align-items-center py-10px dropdown-item text-wrap">
                    <div class="fs-20px w-20px">
                        <i class="bi bi-gear text-theme"></i>
                    </div>
                    <div class="flex-1 flex-wrap ps-3">
                        <div class="mb-1 text-white">SETUP COMPLETED</div>
                        <div class="small">3 MINUTES AGO</div>
                    </div>
                    <div class="ps-2 fs-16px">
                        <i class="bi bi-chevron-right"></i>
                    </div>
                </a>
                <a href="#" class="d-flex align-items-center py-10px dropdown-item text-wrap">
                    <div class="fs-20px w-20px">
                        <i class="bi bi-grid text-theme"></i>
                    </div>
                    <div class="flex-1 flex-wrap ps-3">
                        <div class="mb-1 text-white">WIDGET INSTALLATION DONE</div>
                        <div class="small">5 MINUTES AGO</div>
                    </div>
                    <div class="ps-2 fs-16px">
                        <i class="bi bi-chevron-right"></i>
                    </div>
                </a>
                <a href="#" class="d-flex align-items-center py-10px dropdown-item text-wrap">
                    <div class="fs-20px w-20px">
                        <i class="bi bi-credit-card text-theme"></i>
                    </div>
                    <div class="flex-1 flex-wrap ps-3">
                        <div class="mb-1 text-white">PAYMENT METHOD ENABLED</div>
                        <div class="small">10 MINUTES AGO</div>
                    </div>
                    <div class="ps-2 fs-16px">
                        <i class="bi bi-chevron-right"></i>
                    </div>
                </a>
                <hr class="bg-white-transparent-5 mb-0 mt-2" />
                <div class="py-10px mb-n2 text-center">
                    <a href="#" class="text-decoration-none fw-bold">SEE ALL</a>
                </div>
            </div>
        </div>
        <div class="menu-item dropdown dropdown-mobile-full">
            <a href="#user" data-bs-toggle="dropdown" data-bs-display="static" class="menu-link">
                <div class="menu-img online">
                    <img src="/assets/img/user/profile.jpg" alt="Profile" height="60" />
                </div>
                <div class="menu-text d-sm-block d-none">username@account.com</div>
            </a>
            <div class="dropdown-menu dropdown-menu-end me-lg-3 fs-11px mt-1">
                <a class="dropdown-item d-flex align-items-center" href="/user">PROFILE <i class="bi bi-person-circle ms-auto text-theme fs-16px my-n1"></i></a>
                <a class="dropdown-item d-flex align-items-center" href="/user/settings">SETTINGS <i class="bi bi-gear ms-auto text-theme fs-16px my-n1"></i></a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item d-flex align-items-center" href="/login">LOGOUT <i class="bi bi-toggle-off ms-auto text-theme fs-16px my-n1"></i></a>
            </div>
        </div>
    </div>
    <!-- END menu -->
    
    <!-- BEGIN menu-search -->
    <form class="menu-search" method="POST" name="header_search_form">
        <div class="menu-search-container">
            <div class="menu-search-icon"><i class="bi bi-search"></i></div>
            <div class="menu-search-input">
                <input type="text" class="form-control form-control-lg" placeholder="Search menu..." />
            </div>
            <div class="menu-search-icon">
                <a href="#close" on:click={() => showSearch(false)}><i class="bi bi-x-lg"></i></a>
            </div>
        </div>
    </form>
    <!-- END menu-search -->
</div>
<!-- END #header -->