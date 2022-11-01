<!-- BEGIN gallery-menu-container -->
<div class="gallery-menu-container">
    <!-- BEGIN scrollbar -->
    <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
        <!-- BEGIN gallery-menu -->
        <div class="gallery-menu">
            <div class="p-3 d-flex align-items-center">
                <a href="javascript:window.history.back();" class="btn btn-outline-default text-nowrap btn-sm px-3 rounded-pill"><i class="fa fa-arrow-left me-1 ms-n1"></i> Back</a>
            </div>
            <slot />
        </div>
        <!-- END gallery-menu -->
    </div>
    <!-- end scrollbar -->
</div>
<!-- END gallery-menu-container -->