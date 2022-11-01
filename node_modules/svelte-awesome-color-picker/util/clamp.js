/**
 * Clamps value between a minimum and a maximum.
 * @param value Numeric value to clamp.
 * @param min Lower bound
 * @param max Upper bound
 * @returns clamped value between the lower and upper bound.
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(min, value), max);
}
