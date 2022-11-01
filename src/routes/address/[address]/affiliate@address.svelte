<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    import { page } from '$app/stores';
    
    let address = $page.params.address

    let scripts = [
	    "/assets/js/demo/page-gallery.demo.js"
    ];

    if (browser) {
        onMount(async () => {
            console.log("$page: ", $page);
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
        This is where will will show how much money the affiliate has made, how many products they've sold, etc. {address}
    </div>
</div>