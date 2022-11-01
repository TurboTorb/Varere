import { SvelteComponentTyped } from "svelte";
import type { Components } from '../type/types';
declare const __propDef: {
    props: {
        components: Components;
        toRight: boolean;
        h: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type SliderProps = typeof __propDef.props;
export declare type SliderEvents = typeof __propDef.events;
export declare type SliderSlots = typeof __propDef.slots;
export default class Slider extends SvelteComponentTyped<SliderProps, SliderEvents, SliderSlots> {
}
export {};
