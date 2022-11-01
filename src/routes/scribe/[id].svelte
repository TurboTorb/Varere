<script context="module">
    export async function load({ fetch, params }) {
        const id = params.id;
        const res = await fetch(`/api/projects/${id}`);
        const { project } = await res.json();

        if (res.ok) {
            return {
                props: {
                    selection: project
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
    import { project } from '../../scribe.js';
    
    export let selection;

    if (browser) {
        onMount(async () => {
            project.set(selection);
        });
    }
</script>

<div class="login">
	<!-- BEGIN login-content -->
	<div class="login-content">
        This is a placeholder for {project.label}
    </div>
</div>