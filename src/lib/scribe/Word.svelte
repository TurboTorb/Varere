<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from '$app/env';
    import debounce from 'lodash/debounce';
    import Utils from '../../utils.js';
    import { project, transcript } from '../../scribe.js';
    import { v4 as uuidv4 } from 'uuid';
    import { createEventDispatcher } from 'svelte';
    import sanitizeHtml from 'sanitize-html';

    export let segment;
    export let time;
    export let player;
    export let word;
    export let index;

    let span;
    const dispatch = createEventDispatcher();

	function highlight(start, end) {
		dispatch('highlight', { start, end });
	}

    function playSnippet(e) {
        e.stopPropagation();
        e.preventDefault();
        dispatch('playsnippet');
    }

    function withinTimeframe() {
        if (time >= word.startTime && time <= word.endTime) return true;
        return false;
    }

    function sanitize(input) {
        input = decodeURI(input.trim());
        return sanitizeHtml(input, {
            allowedTags: [ 'br' ],
            selfClosing: [ 'br' ],
            allowedAttributes: false // false actually allows all and any attributes
        });
    }

    function updateWord() {
        let s = span.innerText || span.innerHTML; 
        if (s != word.word) {
            word.word = sanitize(s);
            let words = word.word.split(' ');
            if (words.length > 1) {
                estimateTimestamps(words);
            } else {
                saveAndRefresh();
            }
        }
    }

    const estimateTimestamps = debounce(words => {

        // Double check cause this is a debounce
        let s = (span.innerText || span.innerHTML).trim();
        if (s != word.word) word.word = s;
        words = word.word.split(' ');
        if (words.length < 2) return;

        // We still have multiple words in the word block
        let syllables = 0;
        let array = [];
        for (let i = 0; i < words.length; i++) {
            let clone = Utils.clone(word);
            clone.word = words[i];
            let count = Utils.countSyllables(clone.word);
            clone.syllables = count;
            syllables = syllables + count;
            if (count > 0) array.push(clone);
        }
        if (array.length > 1) {
            // Now that we know how many syllables per word and we have multiple words,
            // we can properly split up the total time between the words
            let idx = segment.words.indexOf(word);
            let pos = word.startTime;
            let t = Utils.roundTo(word.endTime - word.startTime, 2);
            let vs = 0;
            for (let i = 0; i < array.length; i++) {
                let obj = array[i];
                obj.startTime = pos;
                let d = Utils.roundTo((obj.syllables / syllables) * t, 2);
                vs = vs + d;
                pos = pos + d;
                obj.endTime = pos;
                if (i == 0) {
                    segment.words.splice(idx, 1, obj);
                } else {
                    segment.words.splice(idx, 0, obj);
                }
                idx++;
            }
            saveAndRefresh();
        }
    }, 1500);

    let clicked = (e) => {
        e.stopPropagation();
        // This will intercept the click event so the underlying
        // waveform won't move the play head.
    }

    let gotFocus = (e) => {
        e.stopPropagation();
        player.pause();
        placeHead(Utils.getCaretPosition(span));
    }

    // Split and Merge

    function punctuation(array, add=true) {
        if (!array || array.length == 0 || !array[array.length-1].word) {
            console.log("Segment word array is empty!");
            return [];
        }
        let word = array[array.length-1].word;
        word = word.trim();
        let hasPunctuation = word.endsWith(',') || word.endsWith('.') || word.endsWith('?') || word.endsWith('!');
        if (hasPunctuation) {
            if (!add) {
                word = word.substring(0, word.length-1);
                array[array.length-1].word = word;
            }
        } else {
            if (add) {
                word = word + '.';
                array[array.length-1].word = word;
            }
        }
        return array;
    }

    function setUpperCase(array, upper=true) {
        if (!array || array.length == 0 || !array[0].word) {
            // We only see this where we are trying to split a segment but there
            // was a bunch of words within just one word object like when we get a 
            // default placeholder back from the clip service.
            // Maybe present a dialog to suggest estimating timestamps for the words.
            console.log("Sentence needs to be split first.");
            return [];
        }
        let word = array[0].word;
        if (upper) {
            word = word[0].toUpperCase() + word.substring(1);
        } else {
            word = word[0].toLowerCase() + word.substring(1); 
        }
        array[0].word = word.trim();
        return array;
    }

    let merge = (idx => {
        if (idx > 0) {
            let a = punctuation($transcript[idx-1].words, false);
            let b = setUpperCase($transcript[idx].words, false);
            $transcript[idx-1].words = a.concat(b);
            $transcript.splice(idx, 1);
            saveAndRefresh();
        }
    });

    let splice = (value => {
        if (value && value.segment) {
        let segment = value.segment;
        let clone = Utils.clone(segment);
        clone.uid = uuidv4();
        if (value.split) {
            let a, b;
            if (value.before) {
                a = segment.words.slice(0, value.word-1);
                b = segment.words.slice(value.word-1, segment.words.length);
            } else {
                a = segment.words.slice(0, value.word);
                b = segment.words.slice(value.word, segment.words.length);
            }
            segment.words = punctuation(a);
            clone.words = setUpperCase(b);
            $transcript.splice(value.index+1, 0, clone);
            saveAndRefresh();
        } else {
            // let req = {
            //   project: $project.id,
            //   startTime: 0,
            //   endTime: 0
            // }
            // pending.set({
            //   index: value.index,
            //   before: value.before
            // });
            // if (value.before) {  
            //   req.startTime = Utils.getSegmentEndTime($transcript[value.index-1]);
            //   req.endTime = Utils.getSegmentStartTime(segment);
            //   if (value.blank) {
            //     fetchBlank(req, value.index);
            //   } else {
            //     fetchTranscript(req, value.index);
            //   }
            // } else {
            //   req.startTime = Utils.getSegmentEndTime(segment);
            //   req.endTime = Utils.getSegmentStartTime($transcript[value.index+1]);
            //   if (value.blank) {
            //     fetchBlank(req, value.index+1);
            //   } else {
            //     fetchTranscript(req, value.index+1);
            //   }
            // }
        }
        }
    });

    let keyPressed = (e) => {
        if (e.code == 'Space') {
            if (e.shiftKey) {
                e.stopPropagation();
                e.preventDefault();
                player.focus();
                if (player.paused) {
                    player.play();
                } else {
                    player.pause();
                }
                return;
            } else if (!player.paused) {
                e.preventDefault();
                player.pause();
                return;
            }
        }
        player.pause();
        if (e.key == "Enter") {
            // Enter Key
            e.preventDefault();
            if (e.shiftKey) {
                // Soft Return: Add a line break
                let pos = Utils.getCaretPosition(span);
                //console.log("Soft Return", pos);
                if (pos == 0) {
                    span.innerHTML = "<br/>" + span.innerText;
                } else if (pos > 0) {
                    span.innerHTML = span.innerText + "<br/>"; 
                }
                updateWord();
            } else {
                let pos = Utils.getCaretPosition(e.target);
                let i = Utils.getElementIndex(e.target);
                let last = segment.words[segment.words.length-1].word.length;
                let split = false;
                let before = false;
                if (pos == 0 && i == 0) {
                    // Add a new blank segment before this segment
                    split = false;
                    before = true;
                } else if (i == segment.words.length-1 && pos == last) {
                    // Add a new blank segment after this segment
                    split = false;
                    before = false;
                } else if (pos >=0 && i >=0) {
                    // Split this segment
                    if (pos == 0) {
                        split = true;
                        before = true;
                    } else {
                        split = true;
                        before = false;
                    }
                } else {
                    console.log("Hard Return.", i, pos, last);
                    return;
                }
                // For now only allow splitting. 
                // Need to figure out how to handle blank segments
                //if (split) { 
                    splice({
                        index: index,
                        word: i+1,
                        caret: pos,
                        segment: segment,
                        split: split,
                        before: before,
                        blank: false
                    });
                //}
            }
        }
        e.stopPropagation();
    }

    let dpos = 0;

    function jumpToEnd(e) {
        let pos = 0;
        if (e.key == 'ArrowRight') pos = word.word.length;
        Utils.setCaretPosition(span, pos);
        if (pos == 0) {
            player.currentTime = word.startTime;
        } else {
            player.currentTime = word.endTime;
        }
    }

    function getAdjustmentAmount(e) {
        let amount = 0;
        if (e.key == 'ArrowLeft') amount = -.0066;
        if (e.key == 'ArrowRight') amount = .0066;
        return amount;
    }
    
    function shift(e) {
        let amount = getAdjustmentAmount(e);
        if (dpos == 0 || dpos == word.word.length) {
            e.stopPropagation();
            e.preventDefault();
            word.startTime = word.startTime + amount;
            word.endTime = word.endTime + amount;
            if (dpos == 0) player.currentTime = word.startTime;
            if (dpos > 0) player.currentTime = word.endTime;
            highlight(word.startTime, word.endTime);
            playSnippet(e);
            saveAndRefresh();
        } else {
            jumpToEnd(e);
        }
    }

    function adjust(e) {
        let amount = getAdjustmentAmount(e);
        if (dpos == 0 || dpos == word.word.length) {
            e.stopPropagation();
            e.preventDefault();
            if (dpos == 0) {
                word.startTime = word.startTime + amount;
                player.currentTime = word.startTime;
            } else {
                word.endTime = word.endTime + amount;
                player.currentTime = word.endTime;
            }
            highlight(word.startTime, word.endTime);
            playSnippet(e);
            saveAndRefresh();
        } else {
            jumpToEnd(e);
        }        
    }

    function moveHead(amount) {
        placeHead(dpos+amount);
    }

    function placeHead(pos) {
        let perc = pos/word.word.length;
        let secs = word.endTime - word.startTime;
        player.currentTime = word.startTime + (secs * perc);
    }

    let keydown = (e) => {
        e.stopPropagation();
        dpos = Utils.getCaretPosition(e.target);
        let i = Utils.getElementIndex(e.target);
        //let word = segment.words[i];
        let prev = segment.words[i-1];
        if (e.altKey) {
            highlight(word.startTime, word.endTime);
            if (e.code == 'Space') playSnippet(e);
            if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') adjust(e);
        } else if (e.metaKey || e.ctrlKey) {
            highlight(word.startTime, word.endTime);
            if (e.code == 'Space') playSnippet(e);
            if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') shift(e);
        } else if (e.key == "Delete" || e.key == "Backspace") {
            if (dpos == 0 && i == 0) {
                // Delete key pressed and first caret position of the first word.
                merge(index);
            }
            if (dpos == 0 && i > 0) {
                // Merge this word with the previous word
                let clone = Utils.clone(word);
                clone.word = prev.word.trim()+word.word.trim();
                clone.startTime = prev.startTime;
                segment.words.splice(i-1, 2, clone);
                saveAndRefresh();
            }
        }
    }

    let keyup = (e) => {
        e.stopPropagation();
        if (e.key == 'Alt' || e.key == 'Meta' || e.key == 'Control') {
            highlight(-1, time);
        }
        // let i = Utils.getElementIndex(e.target);
        // let word = segment.words[i];
        if (e.altKey || e.metaKey || e.ctrlKey) {
            e.preventDefault();
        } else {
            if (e.key == 'ArrowLeft') {
                if (dpos == 0) {
                    // Move Caret
                    let sibling = e.target.previousElementSibling;
                    if (sibling) {
                        var text = sibling.textContent || sibling.innerText;
                        Utils.setCaretPosition(sibling, text.length);
                    }
                } else {
                    // move play head
                    moveHead(-1);
                }
            } else if (e.key == 'ArrowRight') {
                if (dpos == word.word.length) {
                    // Move Caret
                    let sibling = e.target.nextElementSibling;
                    if (sibling) Utils.setCaretPosition(sibling, 0);
                } else {
                    // move play head
                    moveHead(1);
                }
            }
        }
    }

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                //console.log('A child node has been added or removed.');
            } else if (mutation.type === 'attributes') {
                //console.log('The ' + mutation.attributeName + ' attribute was modified.');
            } else {
                updateWord();
            }
        }
    };

    function saveAndRefresh() {
        // invalidate
        segment.words = segment.words;
        $transcript = $transcript; // invalidate
        // TODO: Replace with AppSync
        sessionStorage.setItem($project.id, JSON.stringify($transcript));
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    if (browser) {
        onMount(async () => {
            // Start observing the target node for configured mutations
            observer.observe(span, { 
                attributes: true, 
                childList: true, 
                subtree: true,
                characterData: true  
            });
        });

        onDestroy(() => {
            // Later, you can stop observing
            observer.disconnect();
        });
    }

    function setStyle() {
        if (span && span.style) {
            if (withinTimeframe()) {
                span.style.textDecoration = "underline";
            } else {
                span.style.textDecoration = "none";
            }
        }
    }

    $: if (time) setStyle();

</script>

<style>
    .word-container {
        display: inline-flex;
        cursor: default;
        margin-left: 1px;
        margin-right: 1px;
        padding-top: 0px;
        padding-right: 1px;
        padding-bottom: 1px;
        padding-left: 1px;
        border: none;
        overflow: hidden;
        white-space: nowrap;
    }
    .word-container:hover {
        cursor: arrow;
        margin-top: -1px;
        margin-bottom: -1px;
        margin-left: 0px;
        margin-right: 0px;
        border: dashed grey 1px;
    }
    [contentEditable] {
        cursor: default;
        outline: 0px solid transparent;
    }
</style>

<span id="wspan" bind:this={span} contentEditable="true" class="word-container" on:click={e => clicked(e)} 
      on:focus={e => gotFocus(e)} on:keydown={e => keydown(e)} on:keyup={e => keyup(e)} on:keypress={e => keyPressed(e)}>
      {word.word}
</span>