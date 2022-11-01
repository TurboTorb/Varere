import { SvelteComponentTyped } from "svelte";
import type { Color } from '../type/types';
declare const __propDef: {
    props: {
        button: HTMLElement;
        color: Color;
        isOpen: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type InputProps = typeof __propDef.props;
export declare type InputEvents = typeof __propDef.events;
export declare type InputSlots = typeof __propDef.slots;
export default class Input extends SvelteComponentTyped<InputProps, InputEvents, InputSlots> {
}
export {};
