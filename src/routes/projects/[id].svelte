<script context="module">
    export async function load({ fetch, params }) {
        const id = params.id;
        const url = `/api/projects/${id}.json`;
        console.log("Load", url);
        const res = await fetch(url);
        const { project } = await res.json();

        if (res.ok) {
            return {
                props: {
                    project
                }
            }
        }
        return {
            status: 301,
            redirect: '/projects'
        }
    }
</script>

<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    
    export let project;

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
        This is a placeholder for {project.label}
    </div>
</div>