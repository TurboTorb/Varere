import { SvelteComponentTyped } from "svelte";
import type { Components } from '../type/types';
declare const __propDef: {
    props: {
        components: Components;
        isOpen: boolean;
        h: number;
        s: number;
        v: number;
        a: number;
        hex: string;
        toRight: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type AlphaProps = typeof __propDef.props;
export declare type AlphaEvents = typeof __propDef.events;
export declare type AlphaSlots = typeof __propDef.slots;
export default class Alpha extends SvelteComponentTyped<AlphaProps, AlphaEvents, AlphaSlots> {
}
export {};
