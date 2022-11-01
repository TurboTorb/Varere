import { SvelteComponentTyped } from "svelte";
import type { Color } from '../type/types';
declare const __propDef: {
    props: {
        pos: {
            x: string;
            y: string;
        };
        color: Color;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type PickerIndicatorProps = typeof __propDef.props;
export declare type PickerIndicatorEvents = typeof __propDef.events;
export declare type PickerIndicatorSlots = typeof __propDef.slots;
export default class PickerIndicator extends SvelteComponentTyped<PickerIndicatorProps, PickerIndicatorEvents, PickerIndicatorSlots> {
}
export {};
