export function isHsv(color) {
    return (color.h !== undefined &&
        color.s !== undefined &&
        color.v !== undefined);
}
export function isHex(color) {
    return color.hex !== undefined;
}
export function isRgb(color) {
    return (color.r !== undefined &&
        color.g !== undefined &&
        color.b !== undefined);
}
