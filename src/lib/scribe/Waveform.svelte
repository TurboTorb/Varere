<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/env';
    import { theme } from '../../stores.js';
    import debounce from 'lodash/debounce';

    // Required
    export let uri;
    export let time;
    export let player;

    // Options
    export let height = 142;
    export let barHeight = 2;

    let wavesurfer;
    let count = 0;
    let delay = 4;
    let throttle = true;

    $: if (wavesurfer && uri) wavesurfer.load(uri);
    $: if (time) updatePosition();

    const unsubscribe = theme.subscribe((value) => {
        if (wavesurfer) wavesurfer.setProgressColor(value.color);
    });

    const handleResize = debounce(e => {
        wavesurfer.load(uri);
    }, 300)

    function updatePosition() {
        checkDelay();
        if (throttle) return;
        if (wavesurfer) {
            let progress = time / wavesurfer.getDuration();
            if (!progress) progress = 0;
            if (progress > 1) progress = 1;
            wavesurfer.seekTo(progress);
        }
    }

    function seek() {
        if (player) player.pause();
        setTimeout(function() {
            player.currentTime = wavesurfer.getCurrentTime();
            player.play();
        }, 100);
    }

    function checkDelay() {
        count++;
        if (count == delay) {
            throttle = false;
            count = 0;
        }
    }

    if (browser) {
        onMount(async () => {
            // Dynamically import WaveSurfer because it has a reference to self that does not play well with SSR.
            const WaveSurfer = (await import('wavesurfer.js'));
            wavesurfer = WaveSurfer.default.create({
                container: '#waveform',
                waveColor: 'grey',
                progressColor: $theme.color,
                height: height,
                barHeight: barHeight
            }); 
            // wavesurfer.on('ready', function() {
            // });
            // wavesurfer.on('seek', function() {  
            // });
            window.addEventListener("resize", handleResize); 
        });

        onDestroy(() => {
            unsubscribe();
            wavesurfer.destroy();
            window.removeEventListener("resize", handleResize); 
        });
    }
</script>

<style>
    #waveform {
        cursor: pointer;
    }
</style>

<!-- <div use:WaveContainer on:click={seek}></div> -->
<div id="waveform" on:click={seek}></div>

<!-- https://wavesurfer-js.org/docs/ -->