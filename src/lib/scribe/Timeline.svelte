<script context="module">
  export async function fetchTranscript(pid, startTime, endTime) {
    // pid = test; // test override
    const pad = .025; // give it a little runway on each end
    const url = '/api/transcript/'+pid+'.json?start='+(startTime - pad)+'&end='+(endTime + pad);
    const res = await fetch(url);
    const segments = await res.json();
    console.log('partial', segments);
    if (res.ok) {
      return segments;
    }
    return {
        status: res.status,
        error: 'Could not fetch transcript partial.'
    }
  }
</script>

<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/env';
  import { project, transcript } from '../../scribe.js';
  import debounce from 'lodash/debounce';
  import Utils from "../../utils.js";
  import TimelineSentence from "./TimelineSentence.svelte";
  import Waveform from './Waveform.svelte';
  import { selector } from './Selector.svelte';

  export let time;
  export let audio;
  export let player;
  export let duration;

  const LEFT = "left";
  const RIGHT = "right";

  let scroller;
  let cursor;
  let pause = false;
  let segment;
  let rect;
  let oldRect;
  let evenly = false;
  let scale = 100; // pixels per second
  let snippetStart;
  let snippetEnd;
  let mask;

  const highlight = function(event) {
    let data = event.detail;
    snippetStart = data.start;
    snippetEnd = data.end;
    if (mask) {
      if (data.start < 0) {
        // Reset
        waveOpacity = 40;
        mask.style.left = '0px';
        mask.style.width = '0px';
      } else {
        waveOpacity = 80;
        mask.style.left = data.start * scale+'px';
        mask.style.width = (data.end - data.start) * scale+'px';
      }
    }
  }

  const playSnippet = debounce(event => {
    if (snippetStart >= 0) {
        player.currentTime = snippetStart;
        player.play();
    }
  }, 300);
  
  function moveCursor() {
    if (snippetStart >= 0 && time > snippetEnd) {
        player.pause();
        return;
    }
    if (cursor && !pause) {
      let px = Math.floor(time * scale); // {scale}px == 1 second
      let pos = px - scroller.scrollLeft;
      if (pos < 0 || pos >= scroller.offsetWidth) {
        cursor.style.visibility='hidden';
        return;
      } else {
        cursor.style.visibility='visible';
      }
      cursor.style.left=pos+'px';
      let parent = scroller.closest('.card');
      if (Utils.endOfContainer(cursor, parent, 2)) {
        pause = true;
        scroller.scrollTo({
          top: 0,
          left: scroller.scrollLeft + (parent.offsetWidth / 2),
          behavior: 'smooth'
        });
        setTimeout(function() {
          pause = false;
        }, 50);
      }
    }
  }

  $: if (time) moveCursor();

  // Mouse Drag Resize Code

  const delta = 20;
  let down = false;
  let moved = false;
  let rh = false; // Right Handle
  let lh = false; // Left Handle
  let cntr = false; // Center Handle
  let xDirection = "";
  let oldX = 0;
  let newX = 0;
  let target;
  let width = 0;
  let waveOpacity = 40;

  function getFirstWord() {
    return segment.words[0];
  }

  function getLastWord() {
    return segment.words[segment.words.length-1];
  }

  function updateTimestamp(word, field, perc, seconds) {
    let duration = word.endTime - word.startTime;
    let amount = duration * perc;
    let value = word[field];
    if (seconds > 0) {
      value = duration + amount;
    } else {
      value = duration - amount;
    }
    word[field] = value;
  }

  function recalculateTimestamps(duration, seconds, field) {
    // Shrink or grow all timestamps evenly
    let perc = Math.abs(seconds) / duration;
    for (let i = 0; i < segment.words.length; i++) {
      let word = segment.words[i];
      updateTimestamp(word, field, perc, seconds);
    }
  }

  let focusListener = (e) => {
    // console.log("focus", e.target);
  };

  let hoverListener = (e) => {
    let el = e.target;
    let rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left,      // the relative mouse postion to the element
        y = e.clientY - rect.top,       // ...
        w = rect.right - rect.left,     // width of the element
        h = rect.bottom - rect.top;     // height of the element
        
    let c = "arrow";                    // which cursor to use                    
    //if (y < delta) c += "n";              // north
    //else if ( y > h - delta) c += "s";    // south
    if (x < delta) c = "ew-resize";         // west 
    if (x > w - delta) c = "ew-resize";     // east 
    el.style.cursor = c;
  };

  let timestamp = null;
  let lastMouseX = null;
  let lastMouseY = null;

  function getMouseSpeed(e) {
      if (timestamp === null) {
          timestamp = Date.now();
          lastMouseX = e.screenX;
          lastMouseY = e.screenY;
          return;
      }

      let now = Date.now();
      let dt =  now - timestamp;
      let dx = e.screenX - lastMouseX;
      let dy = e.screenY - lastMouseY;
      let speedX = Math.round(dx / dt * 100);
      let speedY = Math.round(dy / dt * 100);

      timestamp = now;
      lastMouseX = e.screenX;
      lastMouseY = e.screenY;

      return {x: speedX, y: speedY}
  };

  let moveListener = (e) => {
    if (target && segment) {
      let obj = getMouseSpeed(e);
      if (!obj || !obj.x) return; // Sometimes we don't get an accurate speed back.
      if (obj.x > 0) newX = newX + 1;
      if (obj.x < 0) newX = newX - 1;
      let diffX = newX - oldX;

      if (down && target && segment && 
          segment.words && segment.words.length > 0) {
        let first = getFirstWord();
        let last = getLastWord();
        let seconds = Utils.roundTo(diffX / scale, 2); // diffW?
        let lastLength = Utils.roundTo(last.endTime - last.startTime, 2);
        let firstLength = Utils.roundTo(first.endTime - first.startTime, 2);

        moved = true
        //deal with the horizontal case
        if (diffX > 0) {
          xDirection = RIGHT;
          let free = (e.ctrlKey || e.metaKey) ? true : Utils.leftOfSibling(scroller, target);
          if (rh) {
            if (free) {
              // Grow the last word's endTime only
              width = width + diffX;
              target.style.width = width+'px';
            } else {
              newX = oldX;
            }
          }
          if (lh) {
            // Shrink the first word's startTime down before recalculating
            if (firstLength - .1 >= seconds) {
              // Shrink
              width = width - diffX;
              target.style.left = newX+'px';
              target.style.width = width+'px';
            } else if (e.shiftKey) {
              // Shrink all evenly
              evenly = true;
              width = width - diffX;
              if (width > 0) {
                target.style.left = newX+'px';
                target.style.width = width+'px';
              }
            }
          }
          if (cntr) {
            if (free) {
              target.style.left = newX+'px';
            } else {
              newX = oldX;
            }
          }
        } else if (diffX < 0) {
          xDirection = LEFT;
          let free = (e.ctrlKey || e.metaKey) ? true : Utils.rightOfSibling(scroller, target);
          // Restrict swapping ends
          if (rh && width > delta * 2) {
            // Shrink the last word's endTime down before recalcuating
            if (lastLength + seconds > .1) {
              width = width + diffX;
              target.style.width = width+'px';
            } else if (e.shiftKey) {
              // Shrink all evenly
              evenly = true;
              if (width > 0) {
                width = width + diffX;
                target.style.width = width+'px';
              }
            }
          }
          if (lh) {
            if (free) {
              // Grow the first word's startTime only
              width = width - diffX;
              target.style.left = newX+'px';
              target.style.width = width+'px';
            } else {
              newX = oldX;
            }
          } 
          if (cntr) {
            if (free) {
              // Shift all start and end times for each word based on the new position
              target.style.left = newX+'px';
            } else {
              newX = oldX;
            }
          }  
        }
      }
      oldX = newX;
    }
  }

  let downListener = (e) => {
    target = e.target.parentNode;
    segment = Utils.getSegmentByID($transcript, target.id);
    if (target.classList.contains('segment-wrapper')) {
      down = true;
      waveOpacity = 80;
      rect = Utils.getRelativePosition(target);
      oldRect = rect; // We'll use this to compare on upListener
      width = target.offsetWidth;
      newX = rect.left;
      oldX = newX;

      let offsetX = e.clientX - target.getBoundingClientRect().left;
      if (offsetX < delta) {
        lh = true;
      } else {
        lh = false;
      }
      if (offsetX > delta && offsetX < width - delta) {
        cntr = true;
      } else {
        cntr = false;
      }
      if (offsetX > width - delta) {
        rh = true;
      } else {
        rh = false;
      }
    }
  }

  let upListener = (e) => {
    down = false;
    if (!pending.visible) waveOpacity = 40;
    if (target && segment && segment.words && segment.words.length > 0) {
      // We have a segment with at least one word.
      let first = getFirstWord();
      let last = getLastWord();
      rect = Utils.getRelativePosition(target); //rect = target.getBoundingClientRect();
      if (oldRect.left != rect.left || oldRect.right != rect.right) {
        // The sentence was either moved or resized.
        let duration = Utils.roundTo(rect.width / scale, 2);
        if (oldRect.left != rect.left && oldRect.right == rect.right) {
          // Resize startTime
          let seconds = Utils.roundTo((rect.left - oldRect.left) / scale, 2);
          if (evenly) {
            recalculateTimestamps(duration, seconds, 'startTime');
          } else {
            first.startTime = first.startTime + seconds;
          }
        }

        if (oldRect.left == rect.left && oldRect.right != rect.right) {
          // Resize endTime
          let seconds = Utils.roundTo((rect.width - oldRect.width) / scale, 2);
          if (evenly) {
            recalculateTimestamps(duration, seconds, 'endTime');
          } else {
            last.endTime = last.endTime + seconds;
          }
        }

        if (oldRect.left != rect.left && oldRect.right != rect.right && oldRect.width == rect.width) {
          // Shift
          let seconds = Utils.roundTo((rect.left - oldRect.left) / scale, 2);
          Utils.shiftTimestamps(segment, seconds);
        }

        // if (oldRect.left != rect.left && oldRect.right != rect.right && oldRect.width != rect.width) {
          // let seconds = Utils.roundTo((rect.width - oldRect.width) / scale, 2);
        //   // Shift and resize endTime
        //   if (evenly) {

        //   } else {

        //   }
        // }
        $transcript = $transcript; // invalidate
        // TODO: Replace with AppSync
        sessionStorage.setItem($project.id, JSON.stringify($transcript));
      }
    }

    // Clean up
    segment = null;
    oldRect = null;
    evenly = false;
    width = 0;
    oldX = e.pageX;
    lh = false;
    rh = false;
    cntr = false;
  }

  let timelineClicked = (e) => {
    let el = e.currentTarget;
    let r = el.getBoundingClientRect();
    let x = (e.clientX - r.left) + el.scrollLeft;
    player.currentTime = x / scale;
    el.style.cursor = 'default';
  }

  // Waveform Partial Selections

  let pending;
  let waveform;

  function showPending(show) {
    pending.style.left = mask.style.left;
    pending.style.width = mask.style.width;
    pending.visible = show;
    if (show) { waveOpacity = 80; } else { waveOpacity = 40; }
  }

  function getCurrentIndex() {
    let index = -1;
    for (let i=0; i<$transcript.length; i++) {
      let seg = $transcript[i];
      if (seg && seg.words && seg.words.length > 0) {
        let word = seg.words[seg.words.length-1];
        if (word.endTime < snippetStart) index = i + 1;
      }
    }
    return index;
  }

  function selectionStart(event) {
    highlight({detail: {start: -1, end: time}}); // clears the selection
    let mouse = event.detail.mouse;
    player.currentTime = mouse.x / scale;
  }

  function selectionEnd(event) {
    let mouse = event.detail.mouse;
    player.currentTime = mouse.x / scale;
    player.pause();
    let index = getCurrentIndex();
    if (index >= 0) {
      showPending(true);
      fetchTranscript($project.id, snippetStart, snippetEnd).
        then(segments => {
          for (var i = 0; i < segments.length; i++) {
            var seg = segments[i];
            $transcript.splice(index+i, 0, seg);
          }
          highlight({detail: {start: -1, end: time}}); // clears the selection
          showPending(false);
          $transcript = $transcript;
        });
    }
  }

  function selectionChange(event) {
    player.pause();
    let mouse = event.detail.mouse;
    highlight({detail: {start: mouse.startX / scale, end: mouse.x / scale}});
    playSnippet({detail: {start: mouse.startX / scale, end: mouse.x / scale}});
  }

  function cleanup(event) {
    // constitutes a click not a selection
    player.currentTime = event.detail.mouse.x / scale;
  }

  function registerListeners() {
      // Should be able to do <div use:selector on:selstart...> but for some reason 
      // vite won't recognize those custom events so we manually add the listeners here.
      waveform.addEventListener('selstart', selectionStart);
      waveform.addEventListener('selend', selectionEnd);
      waveform.addEventListener('selchange', selectionChange);
      waveform.addEventListener('cleanup', cleanup);
  }

  if (browser) {
      onMount(() => {
        registerListeners();
        pending.visible = false;
      });

      onDestroy(() => {

      });
  }
  
</script>

<style>
  .timeline-container {
    position: relative;
    max-height: 155px;
    min-width: 0px;
    cursor: pointer;
  }
  .waveform-container {
    position: absolute;
    top: -8px;
    height: 142px;
    cursor: pointer;
  }
  .sentence-container {
    position: relative;
    height: 120px;
  }
  .scroller {
    overflow-x: auto;
    overflow-y: hidden;
    cursor: pointer;
  }
  .cursor {
    width: 1px; 
    height: 14px; 
    top: -5px;
  }

  .mask {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 0px;
    height: 100%;
    background-color: black;
    cursor: pointer;
  }

  .loading {
    cursor: pointer;
    position: absolute;
    top: 0px;
    left: -50px !important;
    width: 0px;
    height: 100%;
    padding: 10px;
    color: white;
  }

  .loading:after {
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    -webkit-animation: ellipsis steps(4,end) 900ms infinite;      
    animation: ellipsis steps(4,end) 900ms infinite;
    content: "\2026"; /* ascii code for the ellipsis character */
    width: 0px;
  }

  @keyframes ellipsis {
    to {
      width: 20px;    
    }
  }

  @-webkit-keyframes ellipsis {
    to {
      width: 20px;    
    }
  }
</style>

<div class="timeline-container d-flex flex-column text-break h-100 w-100 rounded"
  on:mousemove={moveListener} on:mouseup={upListener}>
  <div bind:this={scroller} class="d-block w-100 h-100 scroller">
    <div bind:this={cursor} class="position-absolute bg-white cursor"></div>
    <div class="sentence-container d-flex w-100 mt-2"
      on:mouseover={hoverListener} on:focus={focusListener} on:mousedown={downListener}>
      <div bind:this={waveform} class="waveform-container" style="width: {duration * scale}px; opacity: {waveOpacity}%" use:selector>
        <Waveform uri={audio} {time} {player} />
        <div bind:this={mask} class="mask"></div>
        <div bind:this={pending} class="loading text-lg-start"></div>
      </div>
      <div on:click={(e) => timelineClicked(e)}>
        {#each $transcript as segment, index}
            <TimelineSentence {player} {time} {scroller} {index} {segment} {scale} {target} 
                on:highlight={e => highlight(e)} on:playsnippet={e => playSnippet(e)} on:delete
                direction={(cntr) ? 'center' : (lh) ? 'left' : 'right'}/> 
        {/each}
      </div>
    </div>
  </div>
</div>
