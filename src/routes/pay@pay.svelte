<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    import { web3js, contracts, ABIs } from '../stores'
    import Utils from '$lib/utils.js';
    import Radio from '$lib/radio.svelte';

    let scripts = [
        "/assets/js/demo/sidebar-scrollspy.demo.js"
    ];
    let item = {name: "Bitcoin", price: "$1,299"};
    let acceptableCurrencies = [item];
    let cryptoSelected = true;
    let cardSelected = false;
    let bankSelected = false;
    let checkoutTotal = 0;
    let products = [];

    // if (browser) {
        onMount(() => {
            let currentURL = new URL(window.location.href);
            let ids = currentURL.searchParams.getAll('ids');
            console.log("ids: ", ids);
            ids.forEach(id => getProduct(id));
            console.log("products: ", products);
            // calcTotal();
            // scripts.forEach((url) => {
            //     const script = document.createElement('script');
            //     script.src = url;
            //     document.body.append(script);
            // });
            getAcceptableCurrencies();
        });
    // }

    function calcTotal() {
        let total = 0;
        products.forEach(p => {
            console.log("retailPrice: ", $web3js.utils.fromWei(p.retailPrice.toString(), "ether"));
            let price = $web3js.utils.fromWei(p.retailPrice.toString(), "ether");
            total += parseFloat(price);
        })
        checkoutTotal = total;
    }

    async function getAcceptableCurrencies() {
        try {
            // const userAddress = Utils.getUserAddress();
            const acceptableCurrencys = await $contracts.productContract.methods.getCurrencies().call();
            console.log("acceptableCurrencys: ", acceptableCurrencys);
        } catch (error) {
            console.error("error: ", error);
        }

    }

    async function getProduct(id) {
        try {
            const product = await $contracts.productContract.methods.getProduct(id).call();
            if (product.seller == Utils.zeroAddress) {
                console.log("product doesn't exist with id: ", id);
            } else {
                console.log("product with id: ", id, product);
                products.push(product);
                calcTotal();
            }
        } catch (error) {
            console.error("error: ", error);
        }
    }

</script>

<div id="content" class="w-100 my-5 mx-auto" style="padding-left: 24px;">
    <!-- BEGIN container -->
    <div class="container m-5">
        <!-- BEGIN row -->
        <div class="row justify-content-center">
            <!-- BEGIN col-12 -->
            <div class="col-xl-12">
                <!-- BEGIN row -->
                <div class="row">
                    <!-- BEGIN col-9 -->
                    <div class="col-xl-9">
                        <!-- BEGIN #payment -->
                        <div id="payment" class="mb-5">
                            <h4><i class="far fa-credit-card fa-fw text-theme"></i> Pay</h4>
                            <p>Pay with Crypto or Fiat</p>
                            <div class="card">
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item d-flex align-items-center">
                                        <div class="flex-1 text-break">
                                            <!-- <div class="d-flex justify-content-end mx-sm-5">
                                                <a href="#modalEdit" class="btn btn-theme w-100px">Crypto</a>
                                                <a href="#modalEdit" class="btn btn-outline-theme w-100px">Fiat</a>
                                            </div> -->
                                            <div class="d-flex justify-content-end">
                                                <span>
                                                    <i class="fa-solid fa-cart-shopping"></i>
                                                    {Utils.formatAsCurrency(checkoutTotal, 2)} USD
                                                </span>
                                            </div>
                                            <div>
                                                <div>
                                                    Pay with
                                                </div>
                                                <div>
                                                    <Radio bind:checked={cryptoSelected}/>Crypto

                                                    {#if cryptoSelected}
                                                        <div class="my-5 mx-5">Select a currency
                                                            <div class="menu-item dropdown dropdown-mobile-full">
                                                                <a href="#" data-bs-toggle="dropdown" data-bs-display="static" class="menu-link">
                                                                    <div class="menu-icon"><i class="bi bi-bell nav-icon"></i></div>
                                                                    <div class="menu-badge bg-theme"></div>
                                                                </a>
                                                                <div class="dropdown-menu dropdown-menu-start mt-1 w-300px fs-11px pt-1">
                                                                    <h6 class="dropdown-header fs-10px mb-1">Currencies</h6>
                                                                    <div class="dropdown-divider mt-1"></div>
                                                                    {#each acceptableCurrencies as currency}
                                                                        <a href="#" class="d-flex align-items-center py-10px dropdown-item text-wrap">
                                                                            <div class="fs-20px">
                                                                                <i class="bi bi-bag text-theme"></i>
                                                                            </div>
                                                                            <div class="flex-1 flex-wrap ps-3">
                                                                                <div class="mb-1 text-white">{currency.name} ({currency.price})</div>
                                                                                <div class="small">JUST NOW</div>
                                                                            </div>
                                                                            <div class="ps-2 fs-16px">
                                                                                <i class="bi bi-chevron-right"></i>
                                                                            </div>
                                                                        </a>
                                                                    {/each}
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
                                                        </div>
                                                    {/if}
                                                </div>
                                                <div>
                                                    <Radio bind:checked={cardSelected}/>Debit/Credit
                                                </div>
                                                <div>
                                                    <Radio bind:checked={bankSelected}/>Bank Transfer
                                                </div>
                                            </div>
                                            Discount Code
                                            <div><input type="text" class="form-control" placeholder="Enter code here..."/></div>

                                            <!-- <div class="text-white text-opacity-50">
                                                Paypal, Credit Card, Apple Pay, Amazon Pay, Google Wallet, Alipay, Wechatpay
                                            </div> -->

                                            <div class="d-flex justify-content-evenly mx-sm-5">
                                                <a href="#modalEdit" class="btn btn-theme w-100px">Pay Now</a>
                                            </div>

                                        </div>
                                        <div>
                                            <!-- <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-outline-default w-100px">Edit</a> -->
                                        </div>
                                    </div>
                                </div>
                                <div class="card-arrow">
                                    <div class="card-arrow-top-left"></div>
                                    <div class="card-arrow-top-right"></div>
                                    <div class="card-arrow-bottom-left"></div>
                                    <div class="card-arrow-bottom-right"></div>
                                </div>
                            </div>
                        </div>
                        <!-- END #payment -->
                    </div>
                    <!-- END col-9-->
                    <!-- BEGIN col-3 -->
                    <!-- <div class="col-xl-3"> -->
                        <!-- BEGIN #sidebar-bootstrap -->
                        <!-- <nav id="sidebar-bootstrap" class="navbar navbar-sticky d-none d-xl-block">
                            <nav class="nav">
                                <a class="nav-link" href="#general" data-toggle="scroll-to">General</a>
                                <a class="nav-link" href="#notifications" data-toggle="scroll-to">Notifications</a>
                                <a class="nav-link" href="#privacyAndSecurity" data-toggle="scroll-to">Privacy and security</a>
                                <a class="nav-link" href="#payment" data-toggle="scroll-to">Payment</a>
                                <a class="nav-link" href="#shipping" data-toggle="scroll-to">Shipping</a>
                                <a class="nav-link" href="#mediaAndFiles" data-toggle="scroll-to">Media and Files</a>
                                <a class="nav-link" href="#languages" data-toggle="scroll-to">Languages</a>
                                <a class="nav-link" href="#system" data-toggle="scroll-to">System</a>
                                <a class="nav-link" href="#resetSettings" data-toggle="scroll-to">Reset settings</a>
                            </nav>
                        </nav> -->
                        <!-- END #sidebar-bootstrap -->
                    <!-- </div> -->
                    <!-- END col-3 -->
                </div>
                <!-- END row -->
            </div>
            <!-- END col-10 -->
        </div>
        <!-- END row -->
    </div>
    <!-- END container -->
</div>
<!-- END #content -->
    
<!-- BEGIN #modalEdit -->
<div class="modal fade" id="modalEdit">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Edit name</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <div class="row row-space-10">
                        <div class="col-4">
                            <input class="form-control" placeholder="First" value="Sean" />
                        </div>
                        <div class="col-4">
                            <input class="form-control" placeholder="Middle" value="" />
                        </div>
                        <div class="col-4">
                            <input class="form-control" placeholder="Last" value="Ngu" />
                        </div>
                    </div>
                </div>
                <div class="alert alert-muted">
                    <b>Please note:</b> 
                    If you change your name, you can't change it again for 60 days. 
                    Don't add any unusual capitalization, punctuation, characters or random words. 
                    <a href="#" class="alert-link">Learn more.</a>
                </div>
                <div class="mb-3">
                    <label class="form-label">Other Names</label>
                    <div>
                        <a href="#" class="btn btn-outline-default"><i class="fa fa-plus fa-fw"></i> Add other names</a>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-default" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-outline-theme">Save changes</button>
            </div>
        </div>
    </div>
</div>
<!-- END #modalEdit -->