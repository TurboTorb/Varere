<script>
    export let title = "Welcome";
    export let attributes = [];

    let body;
    $: ready(body);
    function ready(body) {
        if (body) {
            attributes.forEach((attr) => {
                body.setAttribute(attr.name, attr.value);
            });
        }
    }
</script>

<svelte:head>
    <title>{title}</title>
    <slot />
</svelte:head>

<svelte:body bind:this={body} />