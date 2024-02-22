import { BoxSymbol, boxSymbols, histoCharsBottomToTop, histoCharsLeftToRight } from './drawingCharacters.js';

/**
 * Draw a simple histogram with a single line of characters.
 * @param data - the data to draw
 * @param min - optional minimum value, defaults to the minimum value in the data
 * @param max - optional maximum value, defaults to the maximum value in the data
 * @param barChars - the characters to use for the bar, defaults to `['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']`
 * @returns a string of the histogram
 */
export function simpleHistogram(
    data: readonly number[],
    min?: number,
    max?: number,
    barChars: string[] = histoCharsBottomToTop,
): string {
    const minVal = min ?? Math.min(...data);
    const maxVal = max ?? Math.max(...data);
    const range = maxVal - minVal || 1;
    const lenBarChars = barChars.length;
    const scale = lenBarChars / range;
    const scaled = data.map((v) => Math.ceil((Math.min(v, maxVal) - minVal) * scale));
    return scaled.map((v) => (v > 0 ? barChars[v - 1] : ' ')).join('');
}

/**
 * Generate a bar line for a value
 * @param value - between 0 and 1 inclusive.
 * @param width - the width of the bar in characters
 * @param padding - optional padding character, defaults to space.
 * @param barChars - the characters to use for the bar, defaults to `['▏', '▎', '▍', '▌', '▋', '▊', '▉', '█']`
 * @returns a string of the bar
 */
export function barHorizontal(
    value: number,
    width: number,
    padding = ' ',
    barChars: string[] = histoCharsLeftToRight,
): string {
    value = Math.max(Math.min(value, 1), 0);

    const histoFractions = barChars.length;
    const barWidth = Math.floor(value * histoFractions * width);
    const fullChar = barChars[histoFractions - 1];
    if (barWidth === 0) return barChars[0].padEnd(width, padding);
    const rep = barWidth / histoFractions;
    const fraction = barWidth % histoFractions;
    return (fullChar.repeat(rep) + (fraction ? barChars[fraction - 1] : '')).padEnd(width, padding);
}

const stPlotChars = {
    left2: boxSymbols[BoxSymbol.leftT],
    left1: boxSymbols[BoxSymbol.bottomT],
    middle: boxSymbols[BoxSymbol.horizontal],
    center: boxSymbols[BoxSymbol.cross],
    right1: boxSymbols[BoxSymbol.bottomT],
    right2: boxSymbols[BoxSymbol.rightT],
    point: '●',
} as const;

/**
 *
 * @param point - the point to plot
 * @param sd - the standard deviation
 * @param mean - the mean
 * @param width - the width of the plot in characters
 * @param range - the +/- range to plot, defaults to 2.5 SD.
 *   A value of 1 would mean to show only the range of a single standard deviation.
 * @returns a string representing the plot
 */
export function plotPointRelativeToStandardDeviation(
    point: number,
    sd: number,
    mean: number,
    width: number,
    range = 2.5,
): string {
    const plot = ' '.repeat(width).split('');
    const scale = width / (2 * range * sd);
    const diff = point - mean;
    const mid = width >> 1;
    const f = (v: number) => Math.min(Math.max(0, Math.floor(v * scale + mid + 0.5)), width - 1);

    const leftMost = f(-2 * sd);
    const rightMost = f(2 * sd);
    for (let i = leftMost; i <= rightMost; i++) {
        plot[i] = stPlotChars.middle;
    }

    plot[mid] = stPlotChars.center;
    plot[f(-sd)] = stPlotChars.left1;
    plot[f(sd)] = stPlotChars.right1;
    plot[leftMost] = stPlotChars.left2;
    plot[rightMost] = stPlotChars.right2;
    plot[f(diff)] = stPlotChars.point;

    return plot.join('');
}
