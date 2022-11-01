<script>
    import { onMount } from 'svelte';

    let scripts = [
        "/assets/js/demo/analytics.demo.js"
    ];

    onMount(async () => {
        scripts.forEach((url) => {
            const script = document.createElement('script');
            script.src = url;
            document.body.append(script);
        })
    });
</script>

<div id="content" class="app-content">   
    <div class="row" data-masonry='true'> 

        <!-- BEGIN col-4 -->
        <div class="col-lg-6 col-xl-4 mb-4">
            <!-- BEGIN card -->
            <div class="card">
                <!-- BEGIN card-body -->
                <div class="card-body">
                    <!-- title -->
                    <div class="d-flex align-items-center mb-2">
                        <div class="flex-fill fw-bold fs-16px">Total sales</div>
                        <a href="#" class="text-decoration-none text-white text-opacity-50">View report</a>
                    </div>

                    <!-- stats -->
                    <div class="d-flex align-items-center h4 mb-3">
                        <div>$821.50</div>
                        <small class="fw-400 ms-auto text-theme">+5%</small>
                    </div>
                    
                    <!-- chart -->
                    <div>
                        <div class="fs-12px fw-bold mb-2 text-white text-opacity-50">SALES OVER TIME</div>
                        <div class="chart mb-2" style="height: 190px">
                            <canvas id="chart1" class="w-100" height="190"></canvas>
                        </div>
                        <div class="d-flex align-items-center justify-content-center fw-bold text-white text-opacity-50">
                            <i class="fa fa-square text-gray-300 me-2"></i> 
                            <span class="fs-12px me-4" data-id="prev-date">&nbsp;</span>
                            <i class="fa fa-square text-theme me-2"></i> 
                            <span class="fs-12px" data-id="today-date">&nbsp;</span>
                        </div>
                    </div>
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
        <!-- END col-4 -->

        <!-- BEGIN col-4 -->
        <div class="col-lg-6 col-xl-4 mb-4">
            <!-- BEGIN card -->
            <div class="card">
                <!-- BEGIN card-body -->
                <div class="card-body">
                    <!-- title -->
                    <div class="d-flex align-items-center mb-2">
                        <div class="flex-fill fs-16px fw-bold">Returning customer rate</div>
                    </div>
        
                    <!-- stats -->
                    <div class="d-flex align-items-center h3 mb-3">
                        <div>52.85%</div>
                        <small class="fw-400 ms-auto text-danger">-7%</small>
                    </div>
                    
                    <!-- chart -->
                    <div>
                        <div class="fs-12px fw-bold mb-2 text-white text-opacity-50">CUSTOMERS</div>
                        <div class="chart mb-2" style="height: 190px">
                            <canvas id="chart3" class="w-100" height="190"></canvas>
                        </div>
                        <div class="d-flex align-items-center justify-content-center text-white text-opacity-50 fw-bold">
                            <i class="fa fa-square text-indigo me-2"></i> 
                            <span class="fs-12px me-4">First-time</span>
                            <i class="fa fa-square text-theme me-2"></i> 
                            <span class="fs-12px">Returning</span>
                        </div>
                    </div>
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
        <!-- END col-4 -->

        <!-- BEGIN col-4 -->
        <div class="col-lg-6 col-xl-4 mb-4">
            <!-- BEGIN card -->
            <div class="card">
                <!-- BEGIN card-body -->
                <div class="card-body">
                    <!-- title -->
                    <div class="d-flex align-items-center mb-2">
                        <div class="flex-fill fw-bold fs-16px">Average order value</div>
                    </div>
        
                    <!-- stats -->
                    <div class="d-flex align-items-center h3 mb-3">
                        <div>$35.12</div>
                        <small class="fw-400 ms-auto text-danger">-3.2%</small>
                    </div>
                    
                    <!-- chart -->
                    <div>
                        <div class="fs-12px fw-bold mb-2 text-white text-opacity-50">ORDERS BY TIME</div>
                        <div class="chart mb-2" style="height: 190px">
                            <canvas id="chart4" class="w-100" height="190"></canvas>
                        </div>
                        <div class="d-flex align-items-center justify-content-center fw-bold text-white text-opacity-50">
                            <i class="fa fa-square text-gray-300 me-2"></i> 
                            <span class="fs-12px me-4" data-id="prev-date">&nbsp;</span>
                            <i class="fa fa-square text-theme me-2"></i> 
                            <span class="fs-12px" data-id="today-date">&nbsp;</span>
                        </div>
                    </div>
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
        <!-- END col-4 -->

    </div>
</div>