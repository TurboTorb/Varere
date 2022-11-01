<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/env';
    import { project, transcript, speakers, focused } from '../../scribe.js';
    import Timeline from '$lib/scribe/Timeline.svelte';
    import Sampler from '$lib/scribe/Sampler.svelte';
    import Speaker from '$lib/scribe/Speaker.svelte';
    import Hotkeys from '$lib/scribe/Hotkeys.svelte';
    import Help from '$lib/scribe/Help.svelte';
    import Utils from "../../utils.js";
    
    let scripts = [
        // "/assets/js/demo/sidebar-scrollspy.demo.js"
    ];

    let poster;
    let source;
    let audio;
    let player;
    let time = 0;
	let duration;
	let paused = true;
    let playerHasFocus = false;
    let segment; // current segment in focus

    // Bind Sampler Functions
    let addSpeaker;
    let sampleImage;
    let cleanup;
    let crop;

    let focusub = focused.subscribe(instance => {
        segment = instance;
        Utils.saveUndo(segment); // Just in case
    });

    function doSample() {
        let instance = addSpeaker();
        if (instance) segment = instance;
    }

    function hasFocus(e) {
        playerHasFocus = true;
    }

    function lostFocus(e) {
        playerHasFocus = false;
    }

    function deleteSegment(event) {
        // Remove the segment from the transcript
        let pos = $transcript.map(function(e) {
            return e.uid;
        }).indexOf(event.detail.uid);
        $transcript.splice(pos, 1);
        $transcript = $transcript; // invalidate
        // TODO: Replace with AppSync
        sessionStorage.setItem($project.id, JSON.stringify($transcript));
    }

    function registerListeners() {
        window.onkeydown = function(e) {
            if (e.key == 'Enter') crop();
            if (e.key == 'Escape') cleanup();
            if ((e.metaKey || e.ctrlKey) && e.keyCode == 90) {
                e.stopPropagation();
                e.preventDefault();
                Utils.undo($transcript);
                $transcript = $transcript; // invalidate
            }
        }
        window.onkeypress = function(e) {
            e.stopPropagation();
            let pressed = e.keyCode;
            if (e.shiftKey){
                pressed += " + Shift";
            } else if (e.ctrlKey){
                pressed += " + Ctrl";
            } else if (e.code == 'Space') {
                // Spacebar
                if (!playerHasFocus) {
                    if (player) {
                        if (player.paused) {
                            player.play();
                        } else {
                            player.pause();
                        }
                    }
                }
            }
        }
    }

    async function loadProject(proj) {
        if (!proj || !proj.hasOwnProperty('directory') || !proj.hasOwnProperty('transcript')) return;
        if (proj.directory.trim() == '' || proj.transcript.trim() == '') return;

        // TODO: Replace with AppSync
        let results = JSON.parse(sessionStorage.getItem(proj.id));
        if (!results || results.length == 0) {
            const response = await fetch('/data/'+proj.directory+'/'+proj.transcript);
            results = await response.json();
        }
        transcript.set(results);

        Utils.countCompleted(results);
        poster = '/data/'+proj.directory+'/'+proj.poster;
        source = '/data/'+proj.directory+'/'+proj.video;
        audio = '/data/'+proj.directory+'/'+proj.audio;
        if (player && proj.time) player.currentTime = proj.time;

        let list = [];
        results.forEach(seg => {
            if (seg && seg.speaker && seg.speaker.name && seg.speaker.name.trim() !== '') {
                const found = list.find(entry => entry.name == seg.speaker.name);
                if (!found) list.push(Utils.clone(seg.speaker));
            }
        });
        speakers.set(list);
    }

    let projsub = project.subscribe(value => {
        loadProject(value);
    });

    if (browser) {
        onMount(async () => {
            scripts.forEach((url) => {
                const script = document.createElement('script');
                script.src = url;
                document.body.append(script);
            });
            registerListeners();
        });
    }

    onDestroy(() => {
        projsub();
        focusub();
        project.merge({ time })
    });

</script>

<style>
    video {
        width: 100%;
        padding: 0px;
        background-color: black;
        outline: 0;
    }

    /* Small devices (landscape phones, 576px and up) */
    @media (min-width: 576px) { video { height: 67vh } }

    /* Medium devices (tablets, 768px and up) */
    @media (min-width: 768px) { video { height: 68vh } }

    /* Large devices (desktops, 992px and up) */
    @media (min-width: 992px) { video { height: 69vh } }

    /* X-Large devices (large desktops, 1200px and up) */
    @media (min-width: 1200px) { video { height: 70vh } }

    /* XX-Large devices (larger desktops, 1400px and up) */
    @media (min-width: 1400px) { video { height: 71vh } }

    .player-container {
        max-height: 100vh;
        overflow: auto;
        padding: 2px;
        background-color: black;
        margin: 2px;
    }

    .content-container {
        width: 100%;
    }

    #notifications {
        height: 18vh;
    }
</style>

<div id="content" class="app-content" style="padding: 10px;">
    <!-- BEGIN container -->
    <div class="content-container">
        <!-- BEGIN row -->
        <div class="row justify-content-center">
            <!-- BEGIN col-12 -->
            <div class="col-xl-12">
                <!-- BEGIN row -->
                <div class="row">
                    <!-- BEGIN col-9 -->
                    <!-- <div class="col-xl-9"> -->
                        <!-- BEGIN #general -->
                        <div id="general" class="mb-2">
                            <div class="card">
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item d-flex align-items-center player-container">
                                        <Sampler {player} {segment} round={true} 
                                            bind:crop={crop} bind:sampleImage={sampleImage} 
                                            bind:cleanup={cleanup} on:sample={() => doSample()}>
                                            <video id="player" bind:this={player} controls poster={poster} src={source} 
                                                on:focus={e => hasFocus(e)} on:blur={e => lostFocus(e)}
                                                bind:currentTime={time} on:play={e => crop()} bind:duration bind:paused>
                                                <track kind="captions">
                                            </video>
                                        </Sampler>
                                        <Speaker {sampleImage} bind:addSpeaker={addSpeaker} />
                                    </div>
                                </div>
                                <div class="card-arrow">
                                    <div class="card-arrow-top-left"></div>
                                    <div class="card-arrow-top-right"></div>
                                    <div class="card-arrow-bottom-left"></div>
                                    <div class="card-arrow-bottom-right"></div>
                                </div>
                            </div>
                        </div>
                        <!-- END #general -->
                        
                        <!-- BEGIN #notifications -->
                        <div id="notifications" class="">
                            <div class="card h-100">
                                <Timeline {time} {player} {audio} {duration} on:delete={(e) => deleteSegment(e)} />
                                <div class="card-arrow">
                                    <div class="card-arrow-top-left"></div>
                                    <div class="card-arrow-top-right"></div>
                                    <div class="card-arrow-bottom-left"></div>
                                    <div class="card-arrow-bottom-right"></div>
                                </div>
                            </div>
                        </div>
                        <!-- END #notifications -->
                    <!-- </div> -->
                    <!-- END col-9-->
                    <!-- BEGIN col-3 -->
                    <!-- <div class="col-xl-3">
                        <nav id="sidebar-bootstrap" class="navbar navbar-sticky d-none d-xl-block">
                            <nav class="nav">
                                <a class="nav-link" href="#general" data-toggle="scroll-to">General</a>
                                <a class="nav-link" href="#notifications" data-toggle="scroll-to">Notifications</a>
                                <a class="nav-link" href="#privacyAndSecurity" data-toggle="scroll-to">Privacy and security</a>
                                <a class="nav-link" href="#payment" data-toggle="scroll-to">Payment</a>
                                <a class="nav-link" href="#shipping" data-toggle="scroll-to">Shipping</a>
                                <a class="nav-link" href="#mediaAndFiles" data-toggle="scroll-to">Media and Files</a>
                                <a class="nav-link" href="#languages" data-toggle="scroll-to">Languages</a>
                                <a class="nav-link" href="#system" data-toggle="scroll-to">System</a>
                                <a class="nav-link" href="#resetSettings" data-toggle="scroll-to">Reset settings</a>
                            </nav>
                        </nav>
                    </div> -->
                    <!-- END col-3 -->
                </div>
                <!-- END row -->
            </div>
            <!-- END col-10 -->
        </div>
        <!-- END row -->
    </div>
    <!-- END container -->
</div>
<!-- END #content -->
    
<Hotkeys />
<Help />

