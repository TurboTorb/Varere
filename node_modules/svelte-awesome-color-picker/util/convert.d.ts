import type { Color, Hex, Hsv, Rgb } from '../type/types';
declare function hsv2Color({ h, s, v, a }: Hsv): Color;
declare function rgb2Color({ r, g, b, a }: Rgb): Color;
declare function hex2Color({ hex }: Hex): Color;
declare const _default: {
    hsv2Color: typeof hsv2Color;
    rgb2Color: typeof rgb2Color;
    hex2Color: typeof hex2Color;
};
export default _default;
