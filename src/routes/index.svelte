<script>
	import { onMount } from 'svelte';
    import { browser } from '$app/env';
	import { goto } from '$app/navigation';

    if (browser) {
        onMount(async () => {
            // short circuit logger.ts debug calls.
            console.debug = function(){};

            setTimeout(function() {
                goto('admin');
            }, 1000); 
        });
    }
</script>

<div class="login clean">
	<!-- BEGIN login-content -->
	<div class="login-content">
    </div>
</div>