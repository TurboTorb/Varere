import { SvelteComponentTyped } from "svelte";
import type { Components } from '../type/types';
declare const __propDef: {
    props: {
        components: Components;
        h: number;
        s: number;
        v: number;
        isOpen: boolean;
        toRight: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type PickerProps = typeof __propDef.props;
export declare type PickerEvents = typeof __propDef.events;
export declare type PickerSlots = typeof __propDef.slots;
export default class Picker extends SvelteComponentTyped<PickerProps, PickerEvents, PickerSlots> {
}
export {};
