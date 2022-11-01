import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        focused: boolean;
        toRight: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type SliderWrapperProps = typeof __propDef.props;
export declare type SliderWrapperEvents = typeof __propDef.events;
export declare type SliderWrapperSlots = typeof __propDef.slots;
export default class SliderWrapper extends SvelteComponentTyped<SliderWrapperProps, SliderWrapperEvents, SliderWrapperSlots> {
}
export {};
