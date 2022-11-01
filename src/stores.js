import { writable } from 'svelte/store';
import Utils from './utils.js';

export const theme = Utils.createStorageReference(true, 'theme', {
    pattern: false,
    name: "theme-warning",
    color: "#ff9f0c",
    rgb: "255,159,12",
    bg: "bg-cover-2"
});

export const showMenus = writable(false);
export const sidebarExpanded = writable(false);
export const themesExpanded = writable(false);
export const showSearchbar = writable(false);
export const web3js = writable();
export const contracts = writable();
export const ABIs = writable();
export const urlParams = writable({
    address: '0x0000000000000000000000000000000000000000'
});