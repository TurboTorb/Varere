import { writable } from 'svelte/store';
import { completed, progress, recent } from './scribe.js';

const segments = [];

let Utils = {
    clone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    countCompleted: function(array) {
        if (array) {
            let count = 0;
            for (let i = 0; i < array.length; i++) {
                let segment = array[i];
                if (segment.completed) count++;
            }
            let perc = Utils.roundTo((count / array.length) * 100, 0);
            completed.set(count);
            progress.set(perc);
        }
    },
    countSyllables: function(word) {
        if (word.length === 0) return 0;
        if (word.length <= 3) return 1;
        let syllables = word.toLowerCase().replace(
            /(?:[^laeiouy]es|ed|[^laeiouy]e)$/, ''
        ).replace(/^y/, ''
        ).match(/[aeiouy]{1,2}/g);
        if (syllables && syllables.length) {
            return syllables.length;
        } else {
            return 0;
        }
    },
    setCaretPosition: function(editable, pos) {
        var range = document.createRange();
        var sel = window.getSelection();
        let child = editable.childNodes[0];
        range.setStart(child, pos);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    },
    getCaretPosition: function(editable, document) {
        let caretPos = 0,
            sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == editable) {
                caretPos = range.endOffset;
            }
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            if (range.parentElement() == editable) {
            let tempEl = document.createElement("span");
            editable.insertBefore(tempEl, editable.firstChild);
            let tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
            }
        }
        return caretPos;
    },
    getElementIndex: function(element) {
        let parent = element.parentElement;
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i] == element) return i;
        }
        return -1;
    },
    getSegmentByID: function(array, uid) {
        for (let i=0; i<array.length; i++) {
            let segment = array[i];
            if (segment.uid == uid) return segment;
        }
        return null;
    },
    getSegmentByTime: function(array, time) {
        for (let i=0; i<array.length; i++) {
            let segment = array[i];
            let start = Utils.getSegmentStartTime(segment);
            let end = Utils.getSegmentEndTime(segment);
            if (time >= start && time <= end) return segment;
        }
        return null;
    },
    getSegmentEndTime: function(segment) {
        return segment.words[segment.words.length-1].endTime;
    },
    getSegmentStartTime: function(segment) {
        return segment.words[0].startTime;
    },
    getTimestamp: function(sec) {
        let hours = Math.floor(sec / 3600);
        let minutes = Math.floor((sec - (hours * 3600)) / 60);
        let seconds = sec - (hours * 3600) - (minutes * 60);
        let rounded = (this.roundTo(seconds, 2)).toFixed(2);
        let parts = rounded.toString().split('.');
        return hours.toString().padStart(2, '0') + ':' + 
              minutes.toString().padStart(2, '0') + ':' + 
              parts[0].padStart(2, '0')+'.'+parts[1];
    },
    shiftTimestamps: function(segment, seconds) {
        // Shift all timestamps evenly
        for (let i = 0; i < segment.words.length; i++) {
            let word = segment.words[i];
            word.startTime = word.startTime + seconds;
            word.endTime = word.endTime + seconds;
        }
    },
    isInViewport: function(element, container) {
        if (!container) container = document.documentElement;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= container.offsetHeight &&
            rect.right <= container.offsetWidth
        );
    },
    isLight: function(color) { 
        var r, g, b, hsp;
        if (color.match(/^rgb/)) {
            color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
            r = color[1];
            g = color[2];
            b = color[3];
        } else {
            color = +("0x" + color.slice(1).replace( 
            color.length < 5 && /./g, '$&$&'));
            r = color >> 16;
            g = color >> 8 & 255;
            b = color & 255;
        }
        hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
        );
        if (hsp>127.5) return true;
        return false;
    },
    leftOfSibling: function(container, target) {
        if (!container || !target) return false;
        let b = false;
        let rect = target.getBoundingClientRect();
        let left = container.scrollLeft + rect.left;
        let sibling = target.nextElementSibling;
        if (sibling) {
            let right = container.scrollLeft + sibling.getBoundingClientRect().left;
            b = (left + target.offsetWidth < right);
        } else {
            // must be the last element
            b = true;
        }
        return b;
    },
    leftOfViewport: function(element, px) {
        if (!px) px = 0;
        const rect = element.getBoundingClientRect();
        let b = (rect.left < 0);                                // anywhere left of the viewport
        if (px > 0) b = (rect.left < 0 && rect.left > (0-px));  // within a range left of the viewport specified by px
    },
    rightOfSibling: function(container, target) {
        if (!container || !target) return false;
        let b = false;
        let rect = target.getBoundingClientRect();
        let left = container.scrollLeft + rect.left;
        let sibling = target.previousElementSibling;
        if (sibling) {
          let right = container.scrollLeft + sibling.getBoundingClientRect().left + sibling.offsetWidth;
          b = (left > right);
        } else if (left >= 0) {
          // Must be the first element
          b = true;
        }
        return b;
    },
    rightOfViewport: function(element, px, container) {
        if (!container) container = document.documentElement;
        if (!px) px = 0;
        const rect = element.getBoundingClientRect();
        const w = container.offsetWidth;
        let b = (rect.right > w); // anywhere right of the viewport
        if (px > 0) b = (rect.right > w && rect.right < w + px); // within a range right of the viewport specified by 'range'
        return b;
    },
    getSiblings: function(element) {
        let siblings = [];
        if (!element.parentNode) return siblings;
        let sibling = element.parentNode.firstElementChild;
        do {
            if (sibling != element) siblings.push(sibling);
        } while (sibling = sibling.nextElementSibling);
        return siblings;
    },
    endOfContainer: function(element, container, offset) {
        if (!offset) offset = 0;
        if (!container) container = document.documentElement;
        const rect = element.getBoundingClientRect();
        const w = container.offsetWidth;
        let b = (rect.right >= w - offset); // anywhere left of the end of the container
        return b;
    },
    getRelativePosition: function(target, parent=null) {
        if (!parent) parent = target.parentNode;
        let rect = target.getBoundingClientRect();
        let prect = parent.getBoundingClientRect();
        return {
          bottom: prect.bottom - rect.bottom,
          height: rect.height,
          left: rect.left - prect.left,
          right: prect.right - rect.right,
          top: rect.top - prect.top,
          width: rect.width,
          x: rect.x - prect.x,
          y: rect.y - prect.y,
        }
    },
    getScreenCordinates: function(obj) {
        let p = {};
        p.x = obj.offsetLeft;
        p.y = obj.offsetTop;
        while (obj.offsetParent) {
            p.x = p.x + obj.offsetParent.offsetLeft;
            p.y = p.y + obj.offsetParent.offsetTop;
            if (obj == document.getElementsByTagName("body")[0]) {
                break;
            }
            else {
                obj = obj.offsetParent;
            }
        }
        return p;
    },
    roundTo: function(n, digits) {
        if (digits === undefined) digits = 0;
        let multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        return Math.round(n) / multiplicator
    },
    saveUndo: function(segment) {
        // An actual segment and not just a placeholder
        if (segment && segment.words) segments.push(Utils.clone(segment));
    },
    undo: function(array) {
        if (segments.length > 0) {
            let copy = segments.pop();
            let pos = array.map(function(e) {
                return e.uid;
            }).indexOf(copy.uid); 
            if (pos >= 0) { 
                let segment = array[pos];
                segment.speaker = copy.speaker;
                segment.words = copy.words;
                recent.set(segment);
                // force invalidate
                segment = segment; 
                array = array;
            }
        }
    },
    getSelectionOffset: function(node) {
        const sel = window.getSelection();
        const currentTextNode = sel.focusNode;
        const textNodes = Utils.getTextNodes(node);
        let offset = sel.focusOffset;
        for (const n of textNodes) {
          if (n === currentTextNode) {
            break;
          } else {
            offset += n.textContent.length;
          }
        }
        return offset;
    },
    setSelectionOffset: function(node, offset) {
        const textNodes = Utils.getTextNodes(node);
        for (const n of textNodes) {
          if (n.textContent.length >= offset) {
            window.getSelection().setPosition(n, offset);
            break;
          } else {
            offset -= n.textContent.length;
          }
        }
    },
    getTextNodes: function(node) {
        let textNodes = [];
        if (node.hasChildNodes()) {
          node.childNodes.forEach(n => {
            if (n.nodeType !== Node.TEXT_NODE) {
              textNodes = textNodes.concat(Utils.getTextNodes(n));
            } else {
              textNodes.push(n);
            }
          });
        }
        return textNodes;
    },
    hideParagraphs: function() {
        // Total hack because Dropzone creates a <p> element that we don't want
        // but I can't figure out how to get it to hide without this stupid function
        setTimeout(function() {
        let elements = document.getElementsByTagName('p');
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.style.display = 'none';
        }
        }, 1000);
    },
    isJSON: function(s) {
        if (typeof(s) == 'string' && s.indexOf('{') == 0 && s.lastIndexOf('}') == s.length-1) return true;
        return false;
    },
    createStorageReference: function(persist, key, def) {
        let val = key;
        if (def) val = def; // if we have a default, use it.
        const getStorage = () => {
            let storage;
            if (typeof window !== "undefined") {
                if (persist) {
                    storage = window.localStorage;
                } else {
                    storage = window.sessionStorage;
                }
                let value = storage.getItem(key); // try and load a previously saved value
                if (value) val = value;
            }
            return storage;
        };
        const store = (value) => {
            if (storage) {
                if (value instanceof Object) value = JSON.stringify(value);
                storage.setItem(key, value);
            }
        };
        let storage = getStorage();
        const { subscribe, set, update } = writable(val);
        return {
            set: (value) => {
                value = (!value) ? {} : (Utils.isJSON(value)) ? JSON.parse(value) : value;
                val = value;
                set(val);
                store(value);
            },
            update,
            merge: (value) => {
                val = (!val) ? {} : (Utils.isJSON(val)) ? JSON.parse(val) : val;
                value = (!value) ? {} : (Utils.isJSON(value)) ? JSON.parse(value) : value;
                Object.assign(val, value);
                set(val);
                store(val);
            },
            subscribe: (func) => {
                if (Utils.isJSON(val)) { 
                    val = JSON.parse(val);
                    set(val); // Always need it as an object in memory.
                }
                return subscribe(func);
            },
            clear: () => {
                set(null);
                if (getStorage()) storage.removeItem(key)
            },
            isMissing: () => {
                if (!val) return true;
                if (typeof(val) === 'string' && 
                   (val.toLowerCase().trim() == "null" || 
                    val.toLowerCase().trim() == "undefined" ||
                    val.trim() == "")) return true;
                return false;
            }
        }
    }
}

export default Utils;