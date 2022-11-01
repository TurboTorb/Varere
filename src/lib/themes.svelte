<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/env';
    import { theme, themesExpanded } from '../stores';

    let app = {color: { theme: '', themeRgb: ''}}; // get's replaced by window.app;
    let styleElem;
    let temp = {
        pattern: false,
        name: "theme-warning",
        color: "#ff9f0c",
        rgb: "255,159,12",
        bg: "bg-cover-1"
    };

    function showPattern(show, save) {
        temp.pattern = show;
        let content = "body:before {background-image: none;}";
        if (!styleElem) {
            styleElem = document.createElement("style"); 
            styleElem.innerHTML = content;
        }
        if (show) {
            document.head.childNodes.forEach((child) => {
                if (child.textContent === content) document.head.removeChild(styleElem);
            });  
        } else {
            document.head.appendChild(styleElem);
        }
        if (save) theme.set(temp);
    }

    function togglePattern() {
        let show = !temp.pattern;
        showPattern(show, true);
    }

    let themes = [
        {label: "Pink", color: "pink", class: "bg-pink", theme: "theme-pink", active: false},
        {label: "Red", color: "red", class: "bg-red", theme: "theme-red", active: false},
        {label: "Orange", color: "orange", class: "bg-warning", theme: "theme-warning", active: false},
        {label: "Yellow", color: "yellow", class: "bg-yellow", theme: "theme-yellow", active: false},
        {label: "Lime", color: "lime", class: "bg-lime", theme: "theme-lime", active: false},
        {label: "Green", color: "Green", class: "bg-green", theme: "theme-green", active: false},
        {label: "Default", color: "teal", class: "bg-teal", theme: "theme-teal", active: true},
        {label: "Cyan", color: "cyan", class: "bg-info", theme: "theme-info", active: false},
        {label: "Blue", color: "blue", class: "bg-primary", theme: "theme-primary", active: false},
        {label: "Purple", color: "purple", class: "bg-purple", theme: "theme-purple", active: false},
        {label: "Indigo", color: "indigo", class: "bg-indigo", theme: "theme-indigo", active: false},
        {label: "Gray", color: "gray", class: "bg-gray-100", theme: "theme-gray-200", active: false}
    ];

    let backgrounds = [
        {id: "cover1", label: "Default", class: "bg-cover-1", url: "/assets/img/cover/cover-thumb-1.jpg", active: true},
        {id: "cover2", label: "Cover 2", class: "bg-cover-2", url: "/assets/img/cover/cover-thumb-2.jpg", active: false},
        {id: "cover3", label: "Cover 3", class: "bg-cover-3", url: "/assets/img/cover/cover-thumb-3.jpg", active: false},
        {id: "cover4", label: "Cover 4", class: "bg-cover-4", url: "/assets/img/cover/cover-thumb-4.jpg", active: false},
        {id: "cover5", label: "Cover 5", class: "bg-cover-5", url: "/assets/img/cover/cover-thumb-5.jpg", active: false}
    ];

    function toggle(e) {
        if (e) e.preventDefault();	
        themesExpanded.set(!$themesExpanded);
    }

    function setSelectedTheme(klass) {
        themes.forEach((entry) => {
            if (entry.theme === klass) {
                entry.active = true;
            } else {
                entry.active = false;
            }
        });
        themes = themes;
    }

    function setSelectedBackground(klass) {
        backgrounds.forEach((entry) => {
            if (entry.class === klass) {
                entry.active = true;
            } else {
                entry.active = false;
            }
        });
        backgrounds = backgrounds;
    }

    function themeSelected(e, klass, save) {
        if (e) e.preventDefault();
        // Remove previous theme from all theme- elements
        for (var x = 0; x < document.body.classList.length; x++) {
            var targetClass = document.body.classList[x];
            if (targetClass.search('theme-') > -1) {
                document.body.classList.remove(targetClass);
            }
        }
        // Add the target theme
        if (klass) document.body.classList.add(klass);
        app.color.theme = (getComputedStyle(document.body).getPropertyValue('--bs-theme')).trim();
        app.color.themeRgb = (getComputedStyle(document.body).getPropertyValue('--bs-theme-rgb')).trim();    
        document.dispatchEvent(new Event('theme-reload'));
        setSelectedTheme(klass);
        temp.name = klass;
        temp.color = app.color.theme;
        temp.rgb = app.color.themeRgb;
        if (save) theme.set(temp);
    }

    function backgroundSelected(e, klass, save) {
        if (e) e.preventDefault();
        // Remove the previous background
        var htmlElm = document.querySelector('html');
        for (var x = 0; x < document.documentElement.classList.length; x++) {
            var targetClass = document.documentElement.classList[x];
            if (targetClass.search('bg-cover-') > -1) {
                htmlElm.classList.remove(targetClass);
            }
        }
        // Add the selected background
        if (klass) htmlElm.classList.add(klass);
        setSelectedBackground(klass);
        temp.bg = klass;
        if (save) theme.set(temp);
    }

    let unsubscribe = theme.subscribe(value => {
        //console.log(value);
		if (value && value instanceof Object) {
            temp = value;
        }
	});
    onDestroy(unsubscribe);

    if (browser) {
        onMount(async () => {
            if (typeof window !== 'undefined') {
                app = window['app'];

                if (!document.body.classList.contains(temp.name)) {
                    themeSelected(null, temp.name, false);
                }
                if (!document.querySelector('html').classList.contains(temp.bg)) {
                    backgroundSelected(null, temp.bg, false);
                }
                showPattern(temp.pattern, false);
                setSelectedTheme(temp.name);
                setSelectedBackground(temp.bg);
            }
        });
    }
</script>

<style>
    input[type=checkbox] {
        position: relative;
        top: 2px;
    }
</style>


<!-- BEGIN theme-panel -->
<div class="app-theme-panel {($themesExpanded) ? 'active' : ''}">
    <div class="app-theme-panel-container">
        <a href="#theme" on:click={toggle} data-toggle="theme-panel-expand" class="app-theme-toggle-btn"><i class="bi bi-sliders"></i></a>
        <div class="app-theme-panel-content">
            <div class="small fw-bold text-white mb-1">Theme Color</div>
            <div class="card mb-3">
                <!-- BEGIN card-body -->
                <div class="card-body p-2">
                    <!-- BEGIN theme-list -->
                    <div class="app-theme-list">
                        {#each themes as entry }
                            <div class="app-theme-list-item {(entry.active) ? 'active' : ''}">
                                <a href="#{entry.color}" on:click={(e) => {themeSelected(e, entry.theme, true)}} 
                                    class="app-theme-list-link {entry.class}" data-theme-class="{entry.theme}" 
                                    data-toggle="theme-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" 
                                    data-bs-container="body" data-bs-title="{entry.label}">&nbsp;</a>
                            </div>
                        {/each}
                    </div>
                    <!-- END theme-list -->
                </div>
                <!-- END card-body -->
                
                <!-- BEGIN card-arrow -->
                <div class="card-arrow">
                    <div class="card-arrow-top-left"></div>
                    <div class="card-arrow-top-right"></div>
                    <div class="card-arrow-bottom-left"></div>
                    <div class="card-arrow-bottom-right"></div>
                </div>
                <!-- END card-arrow -->
            </div>
            
            <div class="small fw-bold text-white mb-1">
                <span>Background</span>
                <span style="float: right"><input type="checkbox" bind:checked={temp.pattern} on:click={togglePattern} /> Pattern</span>
            </div>
            <div class="card">
                <!-- BEGIN card-body -->
                <div class="card-body p-2">
                    <!-- BEGIN theme-cover -->
                    <div class="app-theme-cover">
                        {#each backgrounds as bg }
                            <div class="app-theme-cover-item {(bg.active) ? 'active' : ''}">
                                <a href="#{bg.id}" on:click={(e) => {backgroundSelected(e, bg.class, true)}} 
                                   class="app-theme-cover-link" 
                                   style="background-image: url({bg.url});" data-theme-cover-class="{bg.class}" 
                                   data-toggle="theme-cover-selector" data-bs-toggle="tooltip" data-bs-trigger="hover" 
                                   data-bs-container="body" data-bs-title="{bg.label}">&nbsp;</a>
                            </div>
                        {/each}
                    </div>
                    <!-- END theme-cover -->
                </div>
                <!-- END card-body -->
                
                <!-- BEGIN card-arrow -->
                <div class="card-arrow">
                    <div class="card-arrow-top-left"></div>
                    <div class="card-arrow-top-right"></div>
                    <div class="card-arrow-bottom-left"></div>
                    <div class="card-arrow-bottom-right"></div>
                </div>
                <!-- END card-arrow -->
            </div>
        </div>
    </div>
</div>
<!-- END theme-panel -->