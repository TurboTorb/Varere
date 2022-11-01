import { writable } from 'svelte/store';
import Utils from './utils.js';

export const project = Utils.createStorageReference(true, 'project', {
    "id": "",
    "title": "",
    "label": "",
    "directory": "",
    "poster": "",
    "video": "",
    "audio": "",
    "transcript": "",
    "time": 0
});
export const mode = writable(0); // 0 - transcribe, 1 - translate
export const projects = writable([]);
export const transcript = writable([]);
export const speaker = writable({name: '', image: ''}); // tracks the last speaker
export const speakers = writable([]);
export const focused = writable(); // stores the current segment in the timeline
export const recent = writable(); // stores the most recently edited word object
// export const splice = writable({});
// export const merge = writable(0);
// export const pending = writable({}); // Show which splice/merge is pending a response from the server
export const completed = writable(0); // Total number of sentences completed
export const progress = writable(0); // Total progress listener