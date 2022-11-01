import type SliderIndicator from '../components/SliderIndicator.svelte';
import type PickerIndicator from '../components/PickerIndicator.svelte';
import type PickerWrapper from '../components/PickerWrapper.svelte';
import type SliderWrapper from '../components/SliderWrapper.svelte';
import type Input from '../components/Input.svelte';
import type Wrapper from '../components/Wrapper.svelte';
export declare type Hsv = {
    h: number;
    s: number;
    v: number;
    a?: number;
};
export declare type Rgb = {
    r: number;
    g: number;
    b: number;
    a?: number;
};
export declare type Hex = {
    hex: string;
};
export declare type Color = Hsv | Rgb | Hex;
export declare type Components = {
    pickerIndicator: typeof PickerIndicator;
    sliderIndicator: typeof SliderIndicator;
    alphaIndicator: typeof SliderIndicator;
    pickerWrapper: typeof PickerWrapper;
    sliderWrapper: typeof SliderWrapper;
    alphaWrapper: typeof SliderWrapper;
    input: typeof Input;
    wrapper: typeof Wrapper;
};
