<script>
    import { onDestroy } from 'svelte';
    import { browser } from '$app/env';
    import { project, transcript, focused, speaker, speakers } from '../../scribe.js';
    import Utils from '../../utils.js';

    export let sampleImage;

    let menu;
    let segment;
    let editableDiv;

    $: if (segment && segment.speaker) {
        // This fixes a bug with one-way binding and contenteditable
        if (editableDiv) {
            if (segment.speaker.name) {
                editableDiv.innerText = segment.speaker.name;
            } else {
                editableDiv.innerText = 'Unknown Speaker'
            }
        }
    }

    export const addSpeaker = () => {
        if (!segment || !segment.words) {
            segment = {
                speaker: {
                }
            }
            return segment;
        } 
        return null;
    }

    function avatarAssigned(instance) {
        if (instance && instance.speaker && instance.speaker.image && 
            instance.speaker.image.trim() !== '') return true;
        return false;
    }

    function speakerAssigned(instance) {
        if (instance && instance.speaker && instance.speaker.name && 
            instance.speaker.name.trim() !== '') return true;
        return false;
    }

    function updateSpeakers() {
        if ($speakers && speakerAssigned(segment) && avatarAssigned(segment)) {
            const found = $speakers.find(entry => entry.name == segment.speaker.name);
            if (!found) {
                $speakers.push(Utils.clone(segment.speaker));
                speakers.set($speakers); // force a refresh
            }
            if (!segment.words) segment = null; // hide this component
        }
    }

    let unsubscribe = focused.subscribe(instance => {
        segment = instance; // switch to the current segment upon focus
        if (segment && !speakerAssigned(instance) && segment['words']) {
            // default to a clone of the previous speaker
            segment['speaker'] = Utils.clone($speaker);
        }
        updateSpeakers();
        $transcript = $transcript; // invalidate
        // TODO: Replace with AppSync
        if (browser) sessionStorage.setItem($project.id, JSON.stringify($transcript));
    });

    function speakerSelected(spkr) {
        segment.speaker = Utils.clone(spkr);
        speaker.set(Utils.clone(spkr));
    }

    function handleClick(e) {
        if (e.clientX !== 0 && e.clientY !== 0) { // actual click.
            if (sampleImage) sampleImage();
        }
    }

    function hideMenu() {
        menu.classList.remove('show');
        editableDiv.classList.remove('show');
    }

    function keyUp(e) {
        e.stopPropagation();
    }

    function keyDown(e) {
        e.stopPropagation();
        hideMenu();
        if (e.key == 'Enter') e.target.blur();
    }

    function keyPressed(e) {
        e.stopPropagation();
    }

    function select() {
        if (segment) {
            if (editableDiv) {
                segment.speaker.name = editableDiv.innerText;
                speaker.set(Utils.clone(segment.speaker));
            }
            focused.set(segment);
        }
    }

    if (browser) {
        onDestroy(unsubscribe);
    }
</script>

<style>
    .speaker {
        position: absolute;
        padding: 10px;
        top: 1rem;
        left: 1rem;
        color: var(--bs-theme);
        background-color: rgba(100, 100, 100, 0.3);
    }

    .single-line {
        display:inline;
        white-space: nowrap;
        width:200px;
        overflow: hidden;
    } 
</style>

<div class="d-flex align-items-center speaker rounded-pill" style="visibility: {(segment) ? 'inherit' : 'hidden'}">
    <a href="#profile" on:click={e => handleClick(e)}>
        <img src={(segment && segment.speaker && segment.speaker.image) ? segment.speaker.image : '/assets/img/user/anonymous.png'} 
             alt="" width="50" class="rounded-circle" />
    </a>
    <div class="flex-fill ps-2">
        <div class="dropdown-toggle">
            <div data-bs-toggle="dropdown" class="fw-bold single-line" contenteditable="true" bind:this={editableDiv}
                 on:keydown={e => keyDown(e)} on:keyup={e => keyUp(e)} on:keypress={e => keyPressed(e)} on:blur={e => select()}>
                 <!-- {(segment && segment.speaker && segment.speaker.name) ? segment.speaker.name : 'Unknown Speaker'}  -->
            </div>
            <div bind:this={menu} class="dropdown-menu">
                {#each $speakers as spkr}
                    <a href="#speaker" on:click={e => speakerSelected(spkr)} class="dropdown-item">{spkr.name}</a>
                {/each}
            </div>
        </div>
    </div>
</div>