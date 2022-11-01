<script>
    export let name = "";
    export let date = "";
</script>

<!-- BEGIN gallery -->
<div class="gallery">
    <!-- BEGIN gallery-header -->
    <div class="d-flex align-items-center mb-3">
        <!-- BEGIN gallery-title -->
        <div class="gallery-title mb-0">
            <a href="#gallery">
            {name} <i class="fa fa-chevron-right"></i> 
            <small>{date}</small>
            </a>
        </div>
        <!-- END gallery-title -->
        
        <!-- BEGIN btn-group -->
        <div class="ms-auto btn-group">
            <a href="#play" class="btn btn-outline-default btn-sm"><i class="fa fa-play"></i></a>
            <a href="#add" class="btn btn-outline-default btn-sm"><i class="fa fa-plus"></i></a>
            <a href="#upload" class="btn btn-outline-default btn-sm"><i class="fa fa-upload"></i></a>
        </div>
        <!-- END btn-group -->
    </div>
    <!-- END gallery-header -->
    
    <!-- BEGIN gallery-image -->
    <div class="gallery-image">
        <ul class="gallery-image-list">
            <slot />
        </ul>
    </div>
    <!-- END gallery-image -->
</div>
<!-- END gallery -->