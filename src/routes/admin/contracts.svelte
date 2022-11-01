<script>
    import { onMount } from 'svelte';
    import Checkbox from '$lib/checkbox.svelte';
    import PreorderNFT from '../../truffle/build/contracts/PreorderNFT.json';
    import Stablecoin from '../../truffle/build/contracts/Stablecoin.json';
    import Utils from '$lib/utils';

    let web3js;
    let contracts = [];
    let preorderNFTProxyAddress;
    let stablecoinProxyAddress;
    let preorderNFTContract;
    let stablecoinContract;

    let allSaved = true;
    let scripts = [
		"/assets/js/demo/dashboard.demo.js"
    ];

    let currencies = [];
    let mockCurrencies = [
        {name: "Bitcoin", ticker: "WBTC", address: "0x3h6f93n51bd784nc7bc736274c73899cdt2", active: true, saved: true},
        {name: "Ether", ticker: "WETH", address: "0x83hf880284638302jf88288fsdf30ps08f5", active: true, saved: true},
        {name: "USDC", ticker: "USDC", address: "0x820shd739d7qw662130fh382830f8dsf73f", active: true, saved: true}
    ];

    onMount(async () => {
        preorderNFTProxyAddress = import.meta.env.VITE_PREORDER_NFT_PROXY_ADDRESS;
        stablecoinProxyAddress = import.meta.env.VITE_STABLECOIN_PROXY_ADDRESS;
        web3js = new Web3(ethereum);
        console.log("web3js: ", web3js);
        preorderNFTContract = new web3js.eth.Contract(PreorderNFT.abi, preorderNFTProxyAddress);
        stablecoinContract = new web3js.eth.Contract(Stablecoin.abi, stablecoinProxyAddress);
        console.log("preorderNFTContract: ", preorderNFTContract);
        console.log("stablecoinContract: ", stablecoinContract);
        
        const storeContract = {
            name: "Store Contract", 
            address: preorderNFTProxyAddress
        }
        const stakingContract = {
            name: "Staking Contract", 
            address: stablecoinProxyAddress
        }
        contracts.push(storeContract);
        contracts.push(stakingContract);
        contracts = contracts; //refresh
        console.log("contracts: ", contracts);

        scripts.forEach((url) => {
                const script = document.createElement('script');
                script.src = url;
                document.body.append(script);
            })
        getContractCurrencies();
        // const contractCurrencies = await preorderNFTContract.methods.getCurrencies().call();
        // console.log("contractCurrencies: ", contractCurrencies);
        // contractCurrencies.forEach(cur => {
        //     let currencyObject;
        //     if (cur == "0x70de4cdC0Ac7Cd3FC4E7a378b31049d30dA4b0C6") {
        //         currencyObject = {name: "Bitcoin", ticker: "BTC", address: cur, balance: 0,  active: true, saved: true};
        //     } else if (cur == "0xc7727a194a7BeE9dE33bE0BF5230fF0CCCB78C7B") {
        //         currencyObject = {name: "Ether", ticker: "ETH", address: cur, balance: 0, active: true, saved: true};
        //     } else {
        //         currencyObject = {name: "Coin", ticker: "COIN", address: cur, balance: 0, active: true, saved: true};
        //     }
        //     const currencyContract = new web3js.eth.Contract(Stablecoin.abi, cur);
        //     const currencyBalance = getBalance(cur);
        //     console.log("currencyBalance: ", currencyBalance);
        //     // currencyObject.balance = currencyBalance;
        //     currencies.push(currencyObject);
        // })
        currencies = currencies; // refresh
    });

    async function getContractCurrencies() {
        const contractCurrencies = await preorderNFTContract.methods.getCurrencies().call();
        console.log("contractCurrencies: ", contractCurrencies);
        // contractCurrencies.forEach(cur => {
        for (let i = 0; i < contractCurrencies.length; i++) {
            let addr = contractCurrencies[i];
            let currencyObject;
            if (addr == "0x70de4cdC0Ac7Cd3FC4E7a378b31049d30dA4b0C6") {
                currencyObject = {name: "Bitcoin", ticker: "WBTC", address: addr, balance: 0,  active: true, saved: true};
            } else if (addr == "0xc7727a194a7BeE9dE33bE0BF5230fF0CCCB78C7B") {
                currencyObject = {name: "Ether", ticker: "WETH", address: addr, balance: 0, active: true, saved: true};
            } else {
                currencyObject = {name: "Coin", ticker: "COIN", address: addr, balance: 0, active: true, saved: true};
            }
            const currencyContract = new web3js.eth.Contract(Stablecoin.abi, addr);
            const currencyBalance = await currencyContract.methods.balanceOf(preorderNFTProxyAddress).call();
            console.log("currencyBalance: ", currencyBalance);
            currencyObject.balance = currencyBalance;
            currencies.push(currencyObject);
            currencies = currencies; // refresh
            // getCurrenciesBalances(i);
        }
    }

    async function getCurrenciesBalances(i) {

    }

    function addCurrency() {
        let newCurrency = {
            name: "Name",
            ticker: "TKR",
            address: "0x.....",
            active: false,
            saved: false
        };
        currencies.push(newCurrency);
        currencies = currencies; //refresh
    }

    function saveCurrency() {
        let newCurrencies = [];
        for (let i = 0; i < currencies.length; i++) {
            let cur = currencies[i];
            if (!cur.saved && (cur.name != "Name" || cur.ticker != "TKR" || cur.address != "0x.....")) {
                console.log("cur: ", cur);
                cur.saved = true;
                // TODO: Add currency to acceptableCurrencies array in the contract
                newCurrencies.push(cur);
            } else {
                console.log("Cannot Save Currency");
                currencies.splice(i, 1);
                currencies = currencies; //refresh
                saveCurrency();
            }
        }
        allCurrenciesSaved();
        if (newCurrencies.length > 0) {
            updateCurrencies(newCurrencies);
        }
    }

    async function updateCurrencies(array) {
        console.log("updating");
        if (array.length > 1) {
            console.log("length is gt 1");
            // TODO: Refactor this to bacth
        } else {
            console.log("length is 1");
            try {
                const userAddress = await Utils.getUserAddress();
                console.log("userAddress: ", userAddress);
                const isCurrencyAcceptable = await preorderNFTContract.methods.isCurrencyAcceptable(array[0].address).call();
                console.log("isCurrencyAcceptable: ", isCurrencyAcceptable);
                if (isCurrencyAcceptable) {
                    console.log("Currency is already acceptable");
                    return;
                }
                const addedCurrency = await preorderNFTContract.methods.addAcceptableCurrency(array[0].address).send({ from: userAddress });
                console.log("addedCurrency: ", addedCurrency);
            } catch (error) {
                console.log("error: ", error);
            }
        }
    }

    function closeModal() {
        for (let i = 0; i < currencies.length; i++) {
            let cur = currencies[i];
            if (!cur.saved) {
                currencies.splice(i, 1);
                currencies = currencies; //refresh
                closeModal();
            }
        }
    }

    function toggleActiveCurrency(e) {
        console.log("e: ", e);
        const i = e.detail.index;
        if (currencies[i].saved && currencies[i].active != e.detail) {
            // TODO: Need to update the active status of this currency in the Contract
        }
    }

    function allCurrenciesSaved(length) {
        allSaved = true;
        currencies.forEach(cur => {
            if (!cur.saved) {
                allSaved = false;
            }
        })
    }
    $: allCurrenciesSaved(currencies.length);

    function manage() {

    }

</script>

<div id="content" class="app-content ml-0">
    <!-- BEGIN row -->
    <div class="row">
        {#each contracts as contract, i}
            <h1 class="page-header mb-0">
                <div class="d-flex align-items-center justify-content-between mb-2" on:click={manage}>
                <div>
                    {contract.name}<br/>
                    <small class="mt-1 mb-3" style="font-size: 12px;">{contract.address}</small>
                </div>
                <!-- <small>stats, overview & performance</small><br/> -->
                    <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-outline-theme m-3">
                          <span>Manage</span>
                    </a>
                </div>
            </h1>
            <!-- BEGIN col-3 -->
            <div class="col-xl-3 col-lg-6">
                <!-- BEGIN card -->
                <div class="card mb-3">
                    <!-- BEGIN card-body -->
                    <div class="card-body">
                        <!-- BEGIN title -->
                        <div class="d-flex fw-bold small mb-3">
                            <span class="flex-grow-1">INTERACTIONS</span>
                            <a href="#" data-toggle="card-expand" class="text-white text-opacity-50 text-decoration-none"><i class="bi bi-fullscreen"></i></a>
                        </div>
                        <!-- END title -->
                        <!-- BEGIN stat-lg -->
                        <div class="row align-items-center mb-2">
                            <div class="col-7">
                                <h3 class="mb-0">4.2m</h3>
                            </div>
                            <div class="col-5">
                                <div class="mt-n2" data-render="apexchart" data-type="bar" data-title="Visitors" data-height="30"></div>
                            </div>
                        </div>
                        <!-- END stat-lg -->
                        <!-- BEGIN stat-sm -->
                        <div class="small text-white text-opacity-50 text-truncate">
                            <i class="fa fa-chevron-up fa-fw me-1"></i> 33.3% more than last week<br />
                            <i class="far fa-user fa-fw me-1"></i> 45.5% new addresses<br />
                            <i class="far fa-times-circle fa-fw me-1"></i> 74.25% call/send rate
                        </div>
                        <!-- END stat-sm -->
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
            <!-- END col-3 -->

            <!-- BEGIN col-3 -->
            <div class="col-xl-3 col-lg-6">
                <!-- BEGIN card -->
                <div class="card mb-3">
                    <!-- BEGIN card-body -->
                    <div class="card-body">
                        <!-- BEGIN title -->
                        <div class="d-flex fw-bold small mb-3">
                            <span class="flex-grow-1">CURRENCY BALANCES</span>
                            <a href="#" data-toggle="card-expand" class="text-white text-opacity-50 text-decoration-none"><i class="bi bi-fullscreen"></i></a>
                        </div>
                        <!-- END title -->
                        <!-- BEGIN stat-lg -->
                        <div class="row align-items-center mb-2">
                            <div class="col-7">
                                <h3 class="mb-0">$523,890</h3>
                            </div>
                            <div class="col-5">
                                <div class="mt-n3 mb-n2" data-render="apexchart" data-type="donut" data-title="Visitors" data-height="45"></div>
                            </div>
                        </div>
                        <!-- END stat-lg -->
                        <!-- BEGIN stat-sm -->
                        <div class="small text-white text-opacity-50 text-truncate">
                            {#each currencies as cur, i}
                                {#if cur.address == "0x70de4cdC0Ac7Cd3FC4E7a378b31049d30dA4b0C6"}
                                    <i class="fab fa-btc fa-fw me-1"></i> {Math.trunc((cur.balance/1e18) * 100)/100} {cur.ticker}<br />
                                {:else if cur.address == "0xc7727a194a7BeE9dE33bE0BF5230fF0CCCB78C7B"}
                                    <i class="fab fa-ethereum fa-fw me-1"></i> {Math.trunc((cur.balance/1e18) * 100)/100} {cur.ticker}<br />
                                {/if}
                            {/each}
                            <!-- <i class="fab fa-btc fa-fw me-1"></i> 195,250 BTC<br />
                            <i class="fab fa-ethereum fa-fw me-1"></i> 104,900 ETH<br /> -->
                            <i class="fas fa-dollar-sign fa-fw me-1"></i> 223,740 USDC/DAI
                        </div>
                        <!-- END stat-sm -->
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
            <!-- END col-3 -->
            
            <!-- BEGIN col-3 -->
            <div class="col-xl-3 col-lg-6">
                <!-- BEGIN card -->
                <div class="card mb-3">
                    <!-- BEGIN card-body -->
                    <div class="card-body">
                        <!-- BEGIN title -->
                        <div class="d-flex fw-bold small mb-3">
                            <span class="flex-grow-1">NEW USERS</span>
                            <a href="#" data-toggle="card-expand" class="text-white text-opacity-50 text-decoration-none"><i class="bi bi-fullscreen"></i></a>
                        </div>
                        <!-- END title -->
                        <!-- BEGIN stat-lg -->
                        <div class="row align-items-center mb-2">
                            <div class="col-7">
                                <h3 class="mb-0">4,490</h3>
                            </div>
                            <div class="col-5">
                                <div class="mt-n3 mb-n2" data-render="apexchart" data-type="pie" data-title="Visitors" data-height="45"></div>
                            </div>
                        </div>
                        <!-- END stat-lg -->
                        <!-- BEGIN stat-sm -->
                        <div class="small text-white text-opacity-50 text-truncate">
                            <i class="fa fa-chevron-up fa-fw me-1"></i> 59.5% more than last week<br />
                            <i class="fas fa-bag-shopping fa-fw me-1"></i> 75.5% preorder buyers<br />
                            <i class="fas fa-dollar-sign fa-fw me-1"></i> 24.5% preorder funders
                        </div>
                        <!-- END stat-sm -->
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
            <!-- END col-3 -->

            <!-- BEGIN col-3 -->
            <div class="col-xl-3 col-lg-6">
                <!-- BEGIN card -->
                <div class="card mb-3">
                    <!-- BEGIN card-body -->
                    <div class="card-body">
                        <!-- BEGIN title -->
                        <div class="d-flex fw-bold small mb-3">
                            <span class="flex-grow-1">WITHDRAWABLE NOW</span>
                            <a href="#" data-toggle="card-expand" class="text-white text-opacity-50 text-decoration-none"><i class="bi bi-fullscreen"></i></a>
                        </div>
                        <!-- END title -->
                        <!-- BEGIN stat-lg -->
                        <div class="row align-items-center mb-2">
                            <div class="col-7">
                                <h3 class="mb-0">$35,232</h3>
                            </div>
                            <div class="col-5">
                                <div class="mt-n2" data-render="apexchart" data-type="line" data-title="Visitors" data-height="30"></div>
                            </div>
                        </div>
                        <!-- END stat-lg -->
                        <!-- BEGIN stat-sm -->
                        <div class="small text-white text-opacity-50 text-truncate">
                            <i class="fa fa-chevron-up fa-fw me-1"></i> 20.4% more than last week<br />
                            <i class="fa fa-shopping-bag fa-fw me-1"></i> 33.5% first time orders<br />
                            <i class="fa fa-dollar-sign fa-fw me-1"></i> $6356.21 FIAT to USDC
                        </div>
                        <!-- END stat-sm -->
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
            <!-- END col-3 -->
        <div class="mb-4"></div>
        {/each}
    </div>
</div>

<!-- BEGIN #modalEdit -->
<div class="modal fade" id="modalEdit">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Manage Contract</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"  on:click={closeModal}></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">Acceptable Currencies</label>
                    <div class="row row-space-10 justify-content-center">
                        <div class="col-3">
                            <span class="">Name</span>
                        </div>
                        <div class="col-2">
                            <span class="">Ticker</span>
                        </div>
                        <div class="col-5">
                            <span class="">Address</span>
                        </div>
                        <div class="col-1">
                            <span class="">Active</span>
                        </div>
                    </div>
                    {#each currencies as currency, i}
                        <div class="row row-space-10 justify-content-center">
                            <div class="col-3">
                                <input class="form-control" placeholder={currency.name} bind:value={currency.name} readonly={currency.saved}/>
                            </div>
                            <div class="col-2">
                                <input class="form-control" placeholder={currency.ticker} bind:value={currency.ticker} readonly={currency.saved}/>
                            </div>
                            <div class="col-5">
                                <input class="form-control" placeholder={currency.address} bind:value={currency.address} readonly={currency.saved}/>
                            </div>
                            <div class="col-1">
                                <Checkbox bind:checked={currency.active} index={i} on:toggle={toggleActiveCurrency}/>
                            </div>
                        </div>
                    {/each}
                </div>
                <!-- <div class="alert alert-muted">
                    <b>Please note:</b> 
                    If you change your name, you can't change it again for 60 days. 
                    Don't add any unusual capitalization, punctuation, characters or random words. 
                    <a href="#" class="alert-link">Learn more.</a>
                </div> -->
                <div class="mb-3">
                    <!-- <label class="form-label">Add Currency</label> -->
                    <div on:click={addCurrency}>
                        <a href="#" class="btn btn-outline-default" style="margin-left: 20px;"><i class="fa fa-plus fa-fw"></i> Add currency</a>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-default" data-bs-dismiss="modal" on:click={closeModal}>Close</button>
                <button type="button" class="btn btn-outline-theme" data-bs-dismiss="modal" on:click={saveCurrency}>Save changes</button>
            </div>
        </div>
    </div>
</div>
<!-- END #modalEdit -->