import { SvelteComponentTyped } from "svelte";
import type { Color } from '../type/types';
declare const __propDef: {
    props: {
        pos: number;
        color: Color;
        toRight: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type SliderIndicatorProps = typeof __propDef.props;
export declare type SliderIndicatorEvents = typeof __propDef.events;
export declare type SliderIndicatorSlots = typeof __propDef.slots;
export default class SliderIndicator extends SvelteComponentTyped<SliderIndicatorProps, SliderIndicatorEvents, SliderIndicatorSlots> {
}
export {};
