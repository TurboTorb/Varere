<script>
    import { createEventDispatcher } from "svelte";
    import { theme } from '../stores';

    export let checked = false;
    export let readonly = false;
    export let index = 0;

    const dispatch = createEventDispatcher();

    function toggleChecked() {
        checked = !checked;
        dispatch("toggle", {bool: checked, index: index});
    }

</script>

<div class="d-inline-block mx-2">
    {#if checked}
        <span style="font-size: 1.5em; color: {$theme.color};">
            <i class="fas fa-circle-dot" style="cursor: pointer;" on:click={readonly ? null : toggleChecked}/>
        </span>
    {:else}
        <span style="font-size: 1.5em;">
            <i class="far fa-circle" style="cursor: pointer;" on:click={readonly ? null : toggleChecked}/>
        </span>
    {/if}
</div>