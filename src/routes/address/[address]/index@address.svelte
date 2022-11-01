<script context="module">
    export async function load({ fetch, params }) {
        console.log("params: ", params);
        const address = params.id;
        // const res = await fetch(`/accounts/${id}.json`);
        // const { address } = await res.json();
        console.log("address: ", address);

        // if (res.ok) {
            return {
                props: {
                    address
                }
            }
        // }
        // return {
        //     status: 301,
        //     redirect: '/address'
        // }
    }
</script>

<script>
    // import PageMenu from "$lib/page-menu.svelte";
    import GalleryGroup from "$lib/gallery-group.svelte";
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    
    export let address;

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

<div class="login">
	<!-- BEGIN login-content -->
	<div class="login-content">
        This is a placeholder for {address}
    </div>
</div>