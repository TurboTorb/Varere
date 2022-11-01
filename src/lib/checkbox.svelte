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

<div>
    {#if checked}
        <span style="font-size: 1.5em; color: {$theme.color};">
            <i class="fas fa-square-check" style="cursor: pointer;" on:click={readonly ? null : toggleChecked}/>
        </span>
    {:else}
        <span style="font-size: 1.5em;">
            <i class="fas fa-square" style="cursor: pointer;" on:click={readonly ? null : toggleChecked}/>
        </span>
    {/if}
</div>