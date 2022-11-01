<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/env';
    import { focused } from '../../scribe.js';
    import debounce from 'lodash/debounce';
    import smoothscroll from 'smoothscroll-polyfill';
    import Utils from "../../utils.js";
    import Sentence from "./Sentence.svelte";
    import { createEventDispatcher } from 'svelte';
    import Word from './Word.svelte';
    
    export let index = 0;
    export let segment = {};
    export let scroller;
    export let time;
    export let player;
    export let offsetWidth = 0;
    export let scale;

    export let target;
    export let direction;

    const dispatch = createEventDispatcher();
  
    // Calculated values
    let timestamp = "00:00:00";
    let startTime = 0;
    let endTime = 0;
    let duration = 0
    let length = "0.0s";
    let width = 0;
    let padding = 0;
    let offset = 0;
    let top = 0;
    let left = 0;
    let parent;
    let pos;
    let len;
  
    function reset() {
      timestamp = "00:00:00";
      startTime = 0;
      endTime = 0;
      duration = 0
      length = "0.0s";
      width = 0;
      padding = 0;
      offset = 0;
    }
  
    function calculateSize() {
      startTime = segment.words[0].startTime;
      let last = segment.words.length-1;
      endTime = segment.words[last].endTime;
      duration = endTime - startTime;
      length = duration.toFixed(2)+"s";
      width = duration * scale; // if scale is 50 then : 4 seconds every 200px, for example
      left = startTime * scale;
    }
  
    $: if (segment) {
      reset();
      calculateSize();
      timestamp = Utils.getTimestamp(startTime);
    }
  
    let positioned = false;
  
    function scrollToTime() {
      if (scroller && scroller.scrollTo) {
        if (endTime > 0 && time >= startTime && endTime >= time) {
          if (!positioned) {
            positioned = true;
            if ($focused !== segment) focused.set(segment);
            if (!player.paused) {
              let card = scroller.closest('.card');
              let buffer = (card.offsetWidth / 2) - (width / 2);
              let point = (startTime * scale) - buffer;
              if (point < 0) point = 0;
              scroller.scrollTo({
                top: 0,
                left: point,
                behavior: 'smooth'
              });
            }
          }
        } else {
          positioned = false;
          if ($focused == segment) focused.set(null);
        }
      }
    }

    $: if (time) scrollToTime();

    const finishedResize = debounce(e => {
      bright = false;
      pos = index + 1;
      len = length;
    }, 2000);
  
    function showTimestamps(target) {
      if (!scroller || !parent || !target || target !== parent) return;
      if ((direction == 'center' && offsetWidth >= 130) || 
         (direction != 'center' && offsetWidth >= 95)) {
        let rect = target.getBoundingClientRect();
        let left = scroller.scrollLeft + rect.left;
        let right = left + offsetWidth;
        let start = left / scale;
        let end = right / scale;
        if (direction == 'left' || direction == 'center') {
          bright = true;
          pos = Utils.getTimestamp(start);
        }
        if (direction == 'right' || direction == 'center') {
          bright = true;
          len = Utils.getTimestamp(end);
        }
        finishedResize();
      } else {
        bright = false;
        pos = index + 1;
        len = length;
      }
    }

    $: showTimestamps(target);

    let bright = false;
    let posx = 0;
    let lenx = 0;

    const highlight = function(event) {
      let data = event.detail;
      dispatch('highlight', data);
      if (data.start >= 0) {
        pos = Utils.getTimestamp(data.start);
        len = Utils.getTimestamp(data.end);
        let padding = 68; // roughly the width of the timestamp itself
        let start = Math.floor(data.start * scale);
        let end = Math.ceil(data.end * scale);
        bright = true;
        posx = start - parent.offsetLeft - padding;
        lenx = (parent.offsetLeft + parent.offsetWidth) - end - padding;
      } else {
        posx = 0;
        lenx = 0;
        bright = false;
        pos = index + 1;
        len = length;
      }
    }

    function setEdge(start) {
      //TODO: provide a better looking modal than a simple alert
      if (start) {
        if (time < segment.words[0].endTime) {
          segment.words[0].startTime = time;
        } else {
          alert('Point in time exceeds the first words end time.');
        }
      } else {
        let last = segment.words.length-1;
        if (time > segment.words[last].startTime) {
          segment.words[last].endTime = time;
        } else {
          alert('Point in time is before the last words start time.');
        }
      }
      calculateSize();
    }

    function handleKeydown(e) {
      if (e.metaKey || e.ctrlKey) {
        if (e.key == "Delete" || e.key == "Backspace") {
          e.stopPropagation();
          e.preventDefault();
          // TODO: Show a better modal
          var answer = confirm('Delete the current Segment?')  
          if (answer) dispatch('delete', {uid: segment.uid});
        }
        if (e.key == 'ArrowLeft') {
          e.stopPropagation();
          e.preventDefault();
          Utils.shiftTimestamps(segment, time - endTime);
        }
        if (e.key == 'ArrowRight') {
          e.stopPropagation();
          e.preventDefault();
          Utils.shiftTimestamps(segment, time - startTime);
        }
      }
      if (e.altKey) {
        e.stopPropagation();
        e.preventDefault();
        if (e.key == 'ArrowLeft') {
          //if (time < startTime) setEdge(true);
          if (time > startTime && time < endTime) setEdge(false);
        }
        if (e.key == 'ArrowRight') {
          if (time > startTime && time < endTime) setEdge(true);
          //if (time > endTime) setEdge(false);
        }
      }
    }

    if (browser) {
      onMount(() => {
        if (browser) {
          // kick off the polyfill!
          smoothscroll.polyfill(); // This is needed for smooth scrolling in Safari

          pos = index + 1;
          len = length;
        }
      });

      onDestroy(() => {

      });
    }
  
  </script>
  
  <style>
    .unselectable {
      -moz-user-select: -moz-none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  
    .segment-wrapper {
      min-height: 90px; 
      max-height: 150px;
      margin-top: 10px;
      padding-bottom: 15px;
      outline: none;
    }
  </style>
  
  <div id={segment.uid} bind:this={parent} bind:offsetWidth={offsetWidth} tabindex="-1" on:keydown={(e) => handleKeydown(e)}
    class="position-absolute d-flex flex-column min-w-0 h-100 unselectable segment-wrapper"
    style="width: {width}px; margin-left: {offset}px; margin-right: {padding}px; top: {top}px; left: {left}px"
  >
    <div class="position-absolute font-thin {(bright) ? 'text-white' : 'text-gray-500'} start-0 px-2" style="top: -10px; font-size: 0.6em; margin-left: {posx}px">
      {pos}
    </div>
    <div class="position-absolute font-thin {(bright) ? 'text-white' : 'text-gray-500'} end-0 px-2" style="top: -10px; font-size: 0.6em; margin-right: {lenx}px">
      {(width > 60) ? len : ''}
    </div>
    <Sentence hasfocus={positioned}>
      {#each segment.words as word}
        <Word {segment} {time} {player} {word} {index} on:highlight={e => highlight(e)} on:playsnippet />
      {/each}
    </Sentence>
  </div>