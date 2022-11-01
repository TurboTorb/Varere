<script>
    import { onMount } from 'svelte';
    import Utils from '$lib/utils.js';
    import { web3js, contracts, ABIs } from '../../stores';

    // let web3js;
    let storeAddress;
    let scripts = [
		"/assets/js/demo/dashboard.demo.js"
    ];

    let currencies = [
        {name: "Bitcoin", ticker: "WBTC", address: "0x3h6f93n51bd784nc7bc736274c73899cdt2", balance: 11738.78, withdrawalAmount: 0, active: true, saved: true},
        {name: "Ether", ticker: "WETH", address: "0x83hf880284638302jf88288fsdf30ps08f5", balance: 8746.82, withdrawalAmount: 0, active: true, saved: true},
        {name: "USDC", ticker: "USDC", address: "0x820shd739d7qw662130fh382830f8dsf73f", balance: 23894.90, withdrawalAmount: 0, active: true, saved: true}
    ];

    onMount(async () => {
        scripts.forEach((url) => {
            const script = document.createElement('script');
            script.src = url;
            document.body.append(script);
        })
        console.log("$contracts: ", $contracts);
        storeAddress = $contracts.storeContract._address;
        getContractCurrencies();
        
    });

    async function getContractCurrencies() {
        try {
            console.log("$contracts: ", $contracts);
            console.log("storeContract: ", $contracts.storeContract);
            const userAddress = await Utils.getUserAddress();
            const contractCurrencies = await $contracts.storeContract.methods.getCurrencies().call();
            console.log("contractCurrencies: ", contractCurrencies);
            // contractCurrencies.forEach(cur => {
            for (let i = 0; i < contractCurrencies.length; i++) {
                let addr = contractCurrencies[i];
                console.log("addr: ", addr);
                let currencyObject;
                if (addr == "0x70de4cdC0Ac7Cd3FC4E7a378b31049d30dA4b0C6") {
                    currencyObject = {name: "Bitcoin", ticker: "WBTC", address: addr, balance: 0, withdrawalAmount: 0, active: true, saved: true};
                } else if (addr == "0xc7727a194a7BeE9dE33bE0BF5230fF0CCCB78C7B") {
                    currencyObject = {name: "Ether", ticker: "WETH", address: addr, balance: 0, withdrawalAmount: 0, active: true, saved: true};
                } else {
                    currencyObject = {name: "Coin", ticker: "COIN", address: addr, balance: 0, withdrawalAmount: 0, active: true, saved: true};
                }
                const currencyContract = new $web3js.eth.Contract($ABIs.tokenABI, addr);
                console.log("storeAddress: ", storeAddress);
                const currencyBalance = await currencyContract.methods.balanceOf(storeAddress).call();
                console.log("currencyBalance: ", currencyBalance/1e18);
                const userBalance = await currencyContract.methods.balanceOf(userAddress).call();
                console.log("userBalance: ", userBalance/1e18);
                const userAllowance = await currencyContract.methods.allowance(storeAddress, userAddress).call();
                console.log("allowance: ", userAllowance/1e18);
                // currencyObject.balance = currencyBalance/1e18;
                currencyObject.balance = userAllowance/1e18;
                currencies.push(currencyObject);
                currencies = currencies; // refresh
                // getCurrenciesBalances(i);
            }
        } catch (error) {
            console.log("error: ", error);
        }
    }

    async function withdraw(currency, amount) {
        try {
            const userAddress = await Utils.getUserAddress();
            console.log("userAddress: ", userAddress);
            console.log("currency: ", currency);
            console.log("amount: ", amount);
            // const currencyAddress = await $web3js.utils.toChecksumAddress(currency);
            // console.log("currencyAddress: ", currencyAddress);
            // const withdrawalAmount = await $contracts.storeContract.methods.withdrawSpecificCurrencyBalance(currency, amount).send({ from: userAddress });
            // console.log("withdrawalAmount: ", withdrawalAmount);
            const currencyContract = new $web3js.eth.Contract($ABIs.tokenABI, currency);
            const allowance = await currencyContract.methods.allowance(storeAddress, userAddress).call();
            console.log("allowance: ", allowance/1e18);
            if (allowance >= amount*1e18) console.log("allowance is gte amount");
            const received = await currencyContract.methods.transferFrom(storeAddress, userAddress, (amount*1e18).toString()).send({ from: userAddress });
            console.log("received: ", received);
        } catch (error) {
            console.log("error: ", error);
        }
    }

    async function withdrawAll() {
        try {
            const userAddress = await Utils.getUserAddress();
            console.log("userAddress: ", userAddress);
            // const currencyAddress = await $web3js.utils.toChecksumAddress(currency);
            // console.log("currencyAddress: ", currencyAddress);
            const currencies = await $contracts.storeContract.methods.withdrawAllCurrenciesTotalBalance().send({ from: userAddress });
            console.log("currencies: ", currencies);
            // TODO: I think this chould return an array or currencies
            // Then we'll loop through all currencies and trasnfer them from the contract to the userAddress
        } catch (error) {
            console.log("error: ", error);
        }

    }

    function withdrawFromContract(arr) {
        // TODO: Send this array of currencies and amounts to the Contract to be withdrawn

    }

    function closeModal() {
        
    }

</script>

<div id="content" class="app-content ml-0">
    <!-- BEGIN row -->
    <div class="row">

        <!-- BEGIN col-6 -->
        <div class="col-xl-6">
            <!-- BEGIN card -->
            <div class="card mb-3">
                <!-- BEGIN card-body -->
                <div class="card-body">
                    <!-- BEGIN title -->
                    <div class="d-flex fw-bold small mb-3">
                        <!-- <span class="flex-grow-1">WITHDRAW</span> -->
                        <div class="d-flex align-items-center">
                            <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-outline-theme">
                                  <span>Withdraw</span>
                            </a>
                        </div>
                        <!-- <a href="#" data-toggle="card-expand" class="text-white text-opacity-50 text-decoration-none"><i class="bi bi-fullscreen"></i></a> -->
                    </div>
                    <!-- END title -->
                    <!-- BEGIN row -->
                    <div class="row">
                        <!-- BEGIN col-6 -->
                        <div class="mb-3 mb-lg-0">
                            <div class="d-flex align-items-center">
                                <!-- BEGIN chart -->
                                <div class="w-50px h-50px">
                                    <div data-render="apexchart" data-type="donut" data-title="Visitors" data-height="50"></div>
                                </div>
                                <!-- END chart -->
                                <!-- BEGIN info -->
                                <div class="ps-3 flex-1">
                                    <div class="fs-10px fw-bold text-white text-opacity-50 mb-1">STORE CONTRACT</div>
                                    <div class="mb-2 fs-5 text-truncate">$19,560 / $256,542</div>
                                    <div class="progress h-3px bg-white-transparent-2 mb-1">
                                        <div class="progress-bar bg-theme" style="width: 20%"></div>
                                    </div>
                                    <div class="fs-11px text-white text-opacity-50 mb-2 text-truncate">
                                        Last updated 1 min ago
                                    </div>
                                    <div class="d-flex align-items-center small">
                                        <i class="bi bi-circle-fill fs-6px me-2 text-theme"></i> 
                                        <div class="flex-1">WITHDRAWABLE NOW</div>
                                        <div>$19,560</div> 
                                    </div>
                                    <div class="d-flex align-items-center small">
                                        <i class="bi bi-circle-fill fs-6px me-2 text-theme text-opacity-50"></i> 
                                        <div class="flex-1">TOTAL BALANCE</div>
                                        <div>$256,542</div> 
                                    </div>
                                </div>
                                <!-- END info -->
                            </div>
                        </div>
                        <!-- END col-6 -->
                        <!-- BEGIN col-6 -->
                        <!-- <div class="col-lg-6">
                            <div class="d-flex"> -->
                                <!-- BEGIN chart -->
                                <!-- <div class="w-50px pt-3">
                                    <div data-render="apexchart" data-type="donut" data-title="Visitors" data-height="50"></div>
                                </div> -->
                                <!-- END chart -->
                                <!-- BEGIN info -->
                                <!-- <div class="ps-3 flex-1">
                                    <div class="fs-10px fw-bold text-white text-opacity-50 mb-1">BANDWIDTH</div>
                                    <div class="mb-2 fs-5 text-truncate">83.76GB / 10TB</div>
                                    <div class="progress h-3px bg-white-transparent-2 mb-1">
                                        <div class="progress-bar bg-theme" style="width: 10%"></div>
                                    </div>
                                    <div class="fs-11px text-white text-opacity-50 mb-2 text-truncate">
                                        Last updated 1 min ago
                                    </div>
                                    <div class="d-flex align-items-center small">
                                        <i class="bi bi-circle-fill fs-6px me-2 text-theme"></i> 
                                        <div class="flex-1">HTTP</div>
                                        <div>35.47GB</div> 
                                    </div>
                                    <div class="d-flex align-items-center small">
                                        <i class="bi bi-circle-fill fs-6px me-2 text-theme text-opacity-50"></i> 
                                        <div class="flex-1">FTP</div>
                                        <div>1.25GB</div> 
                                    </div>
                                </div> -->
                                <!-- END info -->
                            <!-- </div>
                        </div> -->
                        <!-- END col-6 -->
                    </div>
                    <!-- END row -->
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
        <!-- END col-6 -->

        <div class="col-xl-6">
            <!-- BEGIN card -->
            <div class="card mb-3">
                <!-- BEGIN card-body -->
                <div class="card-body">
                    <!-- BEGIN title -->
                    <div class="d-flex fw-bold small mb-3">
                        <span class="flex-grow-1">Withdrawal History</span>
                        <a href="#" data-toggle="card-expand" class="text-white text-opacity-50 text-decoration-none"><i class="bi bi-fullscreen"></i></a>
                    </div>
                    <!-- END title -->
                    <!-- BEGIN table -->
                    <div class="table-responsive">
                        <table class="table table-striped table-borderless mb-2px small text-nowrap">
                            <tbody>
                                <tr>
                                    <td>
                                        <span class="d-flex align-items-center">
                                            <i class="bi bi-circle-fill fs-6px text-theme me-2"></i>
                                            Withdrawal: $120.00
                                        </span>
                                    </td>
                                    <td><small>just now</small></td>
                                    <td>
                                        <span class="badge d-block bg-white bg-opacity-25 rounded-0 pt-5px w-70px" style="min-height: 18px">WALLET</span>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a><small style="margin-left: 1rem;">HASH: 0xe3q56r3...</small></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="d-flex align-items-center">
                                            <i class="bi bi-circle-fill fs-6px text-white-transparent-3 me-2"></i>
                                            Withdrawal: $1,300.00
                                        </span>
                                    </td>
                                    <td><small>1 day ago</small></td>
                                    <td>
                                        <span class="badge d-block bg-white bg-opacity-25 rounded-0 pt-5px w-70px" style="min-height: 18px">TREASURY</span>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a><small style="margin-left: 1rem;">HASH: 0x3m6593n...</small></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="d-flex align-items-center">
                                            <i class="bi bi-circle-fill fs-6px text-white-transparent-3 me-2"></i>
                                            Withdrawal: $2,920.00
                                        </span>
                                    </td>
                                    <td><small>1 day ago</small></td>
                                    <td>
                                        <span class="badge d-block bg-white bg-opacity-25 rounded-0 pt-5px w-70px" style="min-height: 18px">WALLET</span>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a><small style="margin-left: 1rem;">HASH: 0xdks94e3...</small></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="d-flex align-items-center">
                                            <i class="bi bi-circle-fill fs-6px text-theme me-2"></i>
                                            Withdrawal: $135.00
                                        </span>
                                    </td>
                                    <td><small>1 day ago</small></td>
                                    <td>
                                        <span class="badge d-block bg-theme text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">BANK</span>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a><small style="margin-left: 1rem;">HASH: 0xl0ef93...</small></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="d-flex align-items-center">
                                            <i class="bi bi-circle-fill fs-6px text-white text-opacity-25 me-2"></i>
                                            Withdrawal: $1,250.00
                                        </span>
                                    </td>
                                    <td><small>2 days ago</small></td>
                                    <td>
                                        <span class="badge d-block bg-white bg-opacity-25 rounded-0 pt-5px w-70px" style="min-height: 18px">TREASURY</span>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a><small style="margin-left: 1rem;">HASH: 0xd7s9df...</small></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="d-flex align-items-center">
                                            <i class="bi bi-circle-fill fs-6px text-theme me-2"></i>
                                            Withdrawal: $3,500.00
                                        </span>
                                    </td>
                                    <td><small>2 days ago</small></td>
                                    <td>
                                        <span class="badge d-block bg-theme text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">BANK</span>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a><small style="margin-left: 1rem;">HASH: 0xsd87gbr...</small></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="d-flex align-items-center">
                                            <i class="bi bi-circle-fill fs-6px text-theme me-2"></i>
                                            Withdrawal: $450.00
                                        </span>
                                    </td>
                                    <td><small>5 days ago</small></td>
                                    <td>
                                        <span class="badge d-block bg-theme text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">BANK</span>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a><small style="margin-left: 1rem;">HASH: 0x9vysdf9...</small></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="d-flex align-items-center">
                                            <i class="bi bi-circle-fill fs-6px text-white text-opacity-25 me-2"></i>
                                            Withdrawal: $4,000.00
                                        </span>
                                    </td>
                                    <td><small>5 days ago</small></td>
                                    <td>
                                        <span class="badge d-block bg-theme text-theme-900 rounded-0 pt-5px w-70px" style="min-height: 18px">BANK</span>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a><small style="margin-left: 1rem;">HASH: 0x9d3r47f...</small></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="d-flex align-items-center">
                                            <i class="bi bi-circle-fill fs-6px text-white-transparent-3 me-2"></i>
                                            Withdrawal: $120.00
                                        </span>
                                    </td>
                                    <td><small>5 days ago</small></td>
                                    <td>
                                        <span class="badge d-block bg-white bg-opacity-25 rounded-0 pt-5px w-70px" style="min-height: 18px">WALLET</span>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a><small style="margin-left: 1rem;">HASH: 0xk937s8d...</small></td>
                                </tr>
                                <tr>
                                    <td>
                                        <span class="d-flex align-items-center">
                                            <i class="bi bi-circle-fill fs-6px text-white text-opacity-25 me-2"></i>
                                            Withdrawal: $1,100.00
                                        </span>
                                    </td>
                                    <td><small>7 days ago</small></td>
                                    <td>
                                        <span class="badge d-block bg-white bg-opacity-25 rounded-0 pt-5px w-70px" style="min-height: 18px">WALLET</span>
                                    </td>
                                    <td><a href="#" class="text-decoration-none text-white"><i class="bi bi-search"></i></a><small style="margin-left: 1rem;">HASH: 0x9sgj0g...</small></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- END table -->
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
    </div>
</div>

<!-- BEGIN #modalEdit -->
<div class="modal fade" id="modalEdit">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Withdraw</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"  on:click={closeModal}></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">Currencies</label>
                    <div class="row row-space-10">
                        <div class="col-3">
                            <span class="">Name</span>
                        </div>
                        <div class="col-3">
                            <span class="">Ticker</span>
                        </div>
                        <div class="col-2">
                            <span class="">Amount</span>
                        </div>
                        <div class="col-2">
                            <span class="">Available</span>
                        </div>
                        <div class="col-1">
                            <!-- <span class="">Active</span> -->
                        </div>
                    </div>
                    {#each currencies as currency, i}
                        <div class="row row-space-10">
                            <div class="col-3">
                                <div class="form-control">{currency.name}</div>
                            </div>
                            <div class="col-3">
                                <div class="form-control">{currency.ticker} </div>
                            </div>
                            <div class="col-2">
                                <input class="form-control" bind:value={currency.withdrawalAmount}/>
                            </div>
                            <div class="col-2">
                                <div class="form-control">{Utils.formatAsCurrency(currency.balance, 2)}</div>
                            </div>
                            <div class="col-1">
                                <!-- <Checkbox bind:checked={currency.active} index={i} on:toggle={toggleActiveCurrency}/> -->
                                <button type="button" class="btn btn-outline-theme" data-bs-dismiss="modal" on:click={() => withdraw(currency.address, currency.withdrawalAmount)}>Withdraw</button>
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
                <!-- <div class="mb-3"> -->
                    <!-- <label class="form-label">Add Currency</label> -->
                    <!-- <div on:click={addCurrency}> -->
                        <!-- <div>
                        <a href="#" class="btn btn-outline-default"><i class="fa fa-plus fa-fw"></i> Add currency</a>
                    </div>
                </div> -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-default" data-bs-dismiss="modal" on:click={closeModal}>Close</button>
                <button type="button" class="btn btn-outline-theme" data-bs-dismiss="modal" on:click={withdrawAll}>Withdraw All</button>
            </div>
        </div>
    </div>
</div>
<!-- END #modalEdit -->