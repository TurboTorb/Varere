import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        wrapper: HTMLElement;
        isOpen: boolean;
        isPopup: boolean;
        toRight: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type WrapperProps = typeof __propDef.props;
export declare type WrapperEvents = typeof __propDef.events;
export declare type WrapperSlots = typeof __propDef.slots;
export default class Wrapper extends SvelteComponentTyped<WrapperProps, WrapperEvents, WrapperSlots> {
}
export {};
