<script context="module">
    export async function uploadImage(pid, sid, base64) {
        const data = {};
        const url = `/api/projects/${pid}/avatar/${sid}.json`;
        const imgData = base64.split(',');
        data["image"] = imgData[1];
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(data)
        });
    };
</script>

<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/env';
    import { project, focused, speaker, speakers } from '../../scribe.js';
    import Cropper from 'cropperjs';
    import html2canvas from 'html2canvas';
    import Utils from '../../utils.js';
    import { v4 as uuidv4 } from 'uuid';
    import { selector } from './Selector.svelte';
    import { createEventDispatcher } from 'svelte';

    export let segment;
    export let player;
    export let round = true;

    const dispatch = createEventDispatcher();

    let container;
    let cropper;
    let croppable = false;
    let image;
    let dataUrl;

    let top = 0;
    let width = 0;
    let height = 0;

    function getRoundedCanvas(sourceCanvas) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let width = sourceCanvas.width;
        let height = sourceCanvas.height;

        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        context.fill();
        return canvas;
    }

    function setStyles() {
        if (round) {
            let list = Array.from(document.getElementsByClassName('cropper-view-box'));
            list.forEach(element => {
                // @ts-ignore
                element.style.borderRadius = '50%';
            });
            list = Array.from(document.getElementsByClassName('cropper-face'));
            list.forEach(element => {
                // @ts-ignore
                element.style.borderRadius = '50%';
            });
        }
    }

    function showCropper(element) {
        cropper = new Cropper(element, {
            aspectRatio: 1,
            viewMode: 3,
            dragMode: 'none',
            zoomable: false,
            ready: function () {
                croppable = true;
                setStyles();
                setCropper();
            }
        });
    }

    function updateSpeakers() {
        if ($speakers && $speaker) {
            const found = $speakers.find(entry => entry.name == segment.speaker.name);
            if (found) found.image = $speaker.image;
        }
    }

    export let sampleImage = () => {
        dispatch('sample');
        croppable = false;
        player.pause();
        if (player.hasAttribute("controls")) player.removeAttribute("controls");

        let m = player.getBoundingClientRect().width / player.videoWidth;
        width = Math.round(player.videoWidth * m);
        height = Math.round(player.videoHeight * m);
        top = Math.round((player.getBoundingClientRect().height - height) / 2);
        html2canvas(player).then(function(screenshot) {
            let image = new Image();
            image.onload = function(e) {
                let canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(image,0,0,width,height);
                dataUrl = canvas.toDataURL();
            }
            image.src = screenshot.toDataURL();
        });
    }

    export let crop = async () => {
        if (!croppable || !cropper) return;
        let canvas = cropper.getCroppedCanvas();
        if (round) canvas = getRoundedCanvas(canvas);
        if (segment) {
            const response = await uploadImage($project.id, uuidv4(), canvas.toDataURL());
            const { src } = await response.json();
            segment.speaker.image = src;
            speaker.set(Utils.clone(segment.speaker)); // track the last speaker to be set.
            focused.set(segment); // update which segment is currently in focus
            updateSpeakers();
        }
        cleanup();
    };

    function removeDrawings() {
        const elements = container.getElementsByClassName("drawing");
        while (elements.length > 0) elements[0].remove();
    }

    export let cleanup = (event) => {
        removeDrawings();
        if (cropper) {
            cropper.clear();
            cropper.destroy();
            cropper = null;
        }
        croppable = false;
        dataUrl = null;
        setTimeout(function() {
            player.setAttribute("controls","controls");
        }, 1000);
    }

    // Mouse Interactions

    let mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
        down: false
    };

    function selectionStart(event) {
        player.pause();
        if (player.hasAttribute("controls")) player.removeAttribute("controls");
    }

    function selectionEnd(event) {
        if (event && event.detail && event.detail.mouse) {
            mouse = event.detail.mouse;
            sampleImage();
        }
    }

    function setCropper() {
        if (mouse.startX > 0 && mouse.startY > 0) {
            let coords = {
                left: mouse.startX,
                top: mouse.startY - top,
                width: Math.abs(mouse.x - mouse.startX),
                height: Math.abs(mouse.y - mouse.startY)
            }
            cropper.setCropBoxData(coords);
        }
    }

    function registerListeners() {
        // Should be able to do <div use:selector on:selstart...> but for some reason 
        // vite won't recognize those custom events so we manually add the listeners here.
        container.addEventListener('selstart', selectionStart);
        container.addEventListener('selend', selectionEnd);
        container.addEventListener('cleanup', cleanup);
    }

    if (browser) {
        onMount(() => { 
            crop(); // This is here to silence the IDE warnings. A call here does nothing.
            registerListeners();
            image.onload = (e) => {
                showCropper(image);
            }          
        });

        onDestroy(() => {
            cleanup();
        });
    }
  </script>

  <style>
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 0px;
    }

    .wrapper {
        position: absolute;
        left: 0px;
        padding: 0px;
        width: 100%;
    }

    img {
        position: relative;
        padding: 0px;
        width: 100%;
        height: 100%;
    }
  </style>

<div bind:this={container} class="container" use:selector >
    <slot />
    <div class="wrapper" style="top: {top}px; height: {height}px; visibility: {croppable ? 'visible' : 'hidden'}">
        <img alt="screenshot" bind:this={image} src={dataUrl} />
    </div>
</div>
  

