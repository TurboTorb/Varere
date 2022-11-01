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
export declare type PickerWrapperProps = typeof __propDef.props;
export declare type PickerWrapperEvents = typeof __propDef.events;
export declare type PickerWrapperSlots = typeof __propDef.slots;
export default class PickerWrapper extends SvelteComponentTyped<PickerWrapperProps, PickerWrapperEvents, PickerWrapperSlots> {
}
export {};
