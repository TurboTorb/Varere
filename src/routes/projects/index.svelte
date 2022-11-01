<script context="module">
    export async function load({ fetch }) {
        const res = await fetch('/api/projects.json');
        const { projects } = await res.json();

        if (res.ok) {
            return {
                props: {
                    all: projects
                }
            }
        }
        return {
            status: res.status,
            error: 'Could not fetch the projects.'
        }
    }
</script>

<script>
    // import PageMenu from "$lib/page-menu.svelte";
    import GalleryGroup from "$lib/gallery/gallery-group.svelte";
    import { onMount } from 'svelte';
    import { browser } from '$app/env';

    export let all;

    let scripts = [
	    "/assets/js/demo/page-gallery.demo.js"
    ];

    if (browser) {
        onMount(async () => {
            scripts.forEach((url) => {
                const script = document.createElement('script');
                script.src = url;
                document.body.append(script);
            });
        });
    }
</script>

<!-- BEGIN #content -->
<div id="content" class="app-content p-0">
    <!-- BEGIN d-flex -->
    <div class="d-block d-md-flex align-items-stretch h-100">
        <!-- <PageMenu>
            <div class="gallery-menu-header">Main</div>
            <div class="gallery-menu-item"><a href="#photos" class="gallery-menu-link active"><i class="fa fa-fw fa-image me-1"></i> Photos</a></div>
            <div class="gallery-menu-item"><a href="#memories" class="gallery-menu-link"><i class="fa fa-fw fa-heart me-1"></i> Memories</a></div>
            <div class="gallery-menu-header">Shared</div>
            <div class="gallery-menu-item"><a href="#activity" class="gallery-menu-link"><i class="fa fa-fw fa-cloud me-1"></i> Activity</a></div>
            <div class="gallery-menu-header">Albums</div>
            <div class="gallery-menu-item"><a href="#all" class="gallery-menu-link"><i class="fa fa-fw fa-camera me-1"></i> All Photos</a></div>
            <div class="gallery-menu-item"><a href="#people" class="gallery-menu-link"><i class="fa fa-fw fa-user me-1"></i> People</a></div>
            <div class="gallery-menu-item"><a href="#places" class="gallery-menu-link"><i class="fa fa-fw fa-map-pin me-1"></i> Places</a></div>
            <div class="gallery-menu-item"><a href="#selfies" class="gallery-menu-link"><i class="fa fa-fw fa-camera-retro me-1"></i> Selfies</a></div>
            <div class="gallery-menu-item"><a href="#panoramas" class="gallery-menu-link"><i class="fa fa-fw fa-video me-1"></i> Panaromas</a></div>
            <div class="gallery-menu-item"><a href="#effect" class="gallery-menu-link"><i class="fa fa-fw fa-star me-1"></i> Depth Effect</a></div>
            <div class="gallery-menu-item"><a href="#screenshots" class="gallery-menu-link"><i class="fa fa-fw fa-mobile me-1"></i> Screenshots</a></div>
        </PageMenu> -->
        <!-- BEGIN gallery-content-container -->
        <div class="gallery-content-container">
            <!-- BEGIN scrollbar -->
            <div data-scrollbar="true" data-height="100%">
                <!-- BEGIN gallery-content -->
                <div class="gallery-content">
                    <GalleryGroup name="Wedding" date="May 11, 2022">
                        <li><a href="/assets/img/products/p1.png" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/products/p1.png" itemprop="thumbnail" alt="image" class="img-product" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-42.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-42.jpg" itemprop="thumbnail" alt="Wedding Image 1" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-43.jpg" itemprop="contentUrl" data-size="752x442"><img src="/assets/img/gallery/gallery-43.jpg" itemprop="thumbnail" alt="Wedding Image 2" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-44.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-44.jpg" itemprop="thumbnail" alt="Wedding Image 3" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-45.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-45.jpg" itemprop="thumbnail" alt="Wedding Image 4" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-46.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-46.jpg" itemprop="thumbnail" alt="Wedding Image 5" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-47.jpg" itemprop="contentUrl" data-size="752x532"><img src="/assets/img/gallery/gallery-47.jpg" itemprop="thumbnail" alt="Wedding Image 6" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-48.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-48.jpg" itemprop="thumbnail" alt="Wedding Image 7" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-49.jpg" itemprop="contentUrl" data-size="752x1130"><img src="/assets/img/gallery/gallery-49.jpg" itemprop="thumbnail" alt="Wedding Image 8" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-50.jpg" itemprop="contentUrl" data-size="752x1128"><img src="/assets/img/gallery/gallery-50.jpg" itemprop="thumbnail" alt="Wedding Image 9" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-51.jpg" itemprop="contentUrl" data-size="752x866"><img src="/assets/img/gallery/gallery-51.jpg" itemprop="thumbnail" alt="Wedding Image 10" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-52.jpg" itemprop="contentUrl" data-size="752x752"><img src="/assets/img/gallery/gallery-52.jpg" itemprop="thumbnail" alt="Wedding Image 11" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-53.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-53.jpg" itemprop="thumbnail" alt="Wedding Image 12" class="img-portrait" /></a></li>
                    </GalleryGroup>
                    <GalleryGroup name="Collections #339" date="May 8, 2022">
                        <li><a href="/assets/img/gallery/gallery-21.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-21.jpg" itemprop="thumbnail" alt="Collection #145 Image 1" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-22.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-22.jpg" itemprop="thumbnail" alt="Collection #145 Image 2" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-23.jpg" itemprop="contentUrl" data-size="752x486"><img src="/assets/img/gallery/gallery-23.jpg" itemprop="thumbnail" alt="Collection #145 Image 3" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-24.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-24.jpg" itemprop="thumbnail" alt="Collection #145 Image 4" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-25.jpg" itemprop="contentUrl" data-size="752x1128"><img src="/assets/img/gallery/gallery-25.jpg" itemprop="thumbnail" alt="Collection #145 Image 5" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-26.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-26.jpg" itemprop="thumbnail" alt="Collection #145 Image 6" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-27.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-27.jpg" itemprop="thumbnail" alt="Collection #145 Image 7" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-28.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-28.jpg" itemprop="thumbnail" alt="Collection #145 Image 8" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-29.jpg" itemprop="contentUrl" data-size="752x1128"><img src="/assets/img/gallery/gallery-29.jpg" itemprop="thumbnail" alt="Collection #145 Image 9" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-30.jpg" itemprop="contentUrl" data-size="752x940"><img src="/assets/img/gallery/gallery-30.jpg" itemprop="thumbnail" alt="Collection #145 Image 10" /></a></li>
                    </GalleryGroup>
                    <GalleryGroup name="Collections #144" date="May 4, 2022">
                        <li><a href="/assets/img/gallery/gallery-31.jpg" itemprop="contentUrl" data-size="752x752"><img src="/assets/img/gallery/gallery-31.jpg" itemprop="thumbnail" alt="Collection #144 Image 1" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-32.jpg" itemprop="contentUrl" data-size="752x1128"><img src="/assets/img/gallery/gallery-32.jpg" itemprop="thumbnail" class="img-portrait" alt="Collection #144 Image 2" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-33.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-33.jpg" itemprop="thumbnail" alt="Collection #144 Image 3" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-34.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-34.jpg" itemprop="thumbnail" alt="Collection #144 Image 4" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-35.jpg" itemprop="contentUrl" data-size="752x1136"><img src="/assets/img/gallery/gallery-35.jpg" itemprop="thumbnail" alt="Collection #144 Image 5" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-36.jpg" itemprop="contentUrl" data-size="752x1128"><img src="/assets/img/gallery/gallery-36.jpg" itemprop="thumbnail" alt="Collection #144 Image 6" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-37.jpg" itemprop="contentUrl" data-size="752x480"><img src="/assets/img/gallery/gallery-37.jpg" itemprop="thumbnail" alt="Collection #144 Image 7" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-38.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-38.jpg" itemprop="thumbnail" alt="Collection #144 Image 8" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-39.jpg" itemprop="contentUrl" data-size="752x422"><img src="/assets/img/gallery/gallery-39.jpg" itemprop="thumbnail" alt="Collection #144 Image 9" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-40.jpg" itemprop="contentUrl" data-size="752x464"><img src="/assets/img/gallery/gallery-40.jpg" itemprop="thumbnail" alt="Collection #144 Image 10" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-41.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-41.jpg" itemprop="thumbnail" alt="Collection #144 Image 11" class="img-portrait" /></a></li>
                    </GalleryGroup>
                    <GalleryGroup name="Collections #143" date="May 3, 2022">
                        <li><a href="/assets/img/gallery/gallery-1.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-1.jpg" itemprop="thumbnail" alt="Collection #143 Image 1" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-2.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-2.jpg" itemprop="thumbnail" alt="Collection #143 Image 2" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-3.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-3.jpg" itemprop="thumbnail" alt="Collection #143 Image 3" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-4.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-4.jpg" itemprop="thumbnail" alt="Collection #143 Image 4" /></a></li>
                    </GalleryGroup>
                    <GalleryGroup name="Random" date="May 1, 2022">
                        <li><a href="/assets/img/gallery/gallery-5.jpg" itemprop="contentUrl" data-size="752x500"><img src="/assets/img/gallery/gallery-5.jpg" itemprop="thumbnail" alt="Random Image 1" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-6.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-6.jpg" itemprop="thumbnail" alt="Random Image 2" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-7.jpg" itemprop="contentUrl" data-size="752x476"><img src="/assets/img/gallery/gallery-7.jpg" itemprop="thumbnail" alt="Random Image 3" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-8.jpg" itemprop="contentUrl" data-size="752x472"><img src="/assets/img/gallery/gallery-8.jpg" itemprop="thumbnail" alt="Random Image 4" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-9.jpg" itemprop="contentUrl" data-size="752x504"><img src="/assets/img/gallery/gallery-9.jpg" itemprop="thumbnail" alt="Random Image 5" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-10.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-10.jpg" itemprop="thumbnail" alt="Random Image 6" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-11.jpg" itemprop="contentUrl" data-size="752x564"><img src="/assets/img/gallery/gallery-11.jpg" itemprop="thumbnail" alt="Random Image 7" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-12.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-12.jpg" itemprop="thumbnail" alt="Random Image 8" class="img-portrait" /></a></li>
                        <li><a href="/assets/img/gallery/gallery-13.jpg" itemprop="contentUrl" data-size="752x502"><img src="/assets/img/gallery/gallery-13.jpg" itemprop="thumbnail" alt="Random Image 9" class="img-portrait" /></a></li>
                    </GalleryGroup>
                </div>
                <!-- END gallery-content -->
            </div>
            <!-- END scrollbar -->
        </div>
        <!-- END gallery-content-container -->
    </div>
    <!-- END d-flex -->
</div>
<!-- END #content -->
	

