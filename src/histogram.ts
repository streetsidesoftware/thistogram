import { barHorizontal } from './bars.js';
import { BoxSymbol, boxSymbols, histoCharsLeftToRight } from './drawingCharacters.js';

export interface HistogramDrawOptions {
    /**
     * The characters used to draw the box plot.
     * top-left, top-right, bottom-right, bottom-left, vertical, horizontal, left-T, right-T, bottom-T, top-T, cross
     */
    boxSymbols: string[];
    histoChars: string[];
}

export interface HistogramOptions {
    /** The entire table width in characters, including the axis labels, default is 80 */
    width?: number;
    /** The max width of the axis labels on the left, default is 10% of the width  */
    maxLabelWidth?: number;
    drawOptions?: Partial<HistogramDrawOptions>;
    /** The maximum value to show in the graph, defaults to the maximum value in the data. */
    max?: number;
    /** The minimum value to show in the graph, defaults to 0 or the the minimum value whichever is lower */
    min?: number;
    title?: string;
    /** Show the actual values. */
    showValues?: boolean;
    /** The number of significant digits to show in the values. */
    significantDigits?: number;
    /**
     * The column headers.
     * The first column is the label, the second is the value, the third is the min value, and the fourth is the max value.
     */
    headers?: string[];

    /**
     * The chart type to use, defaults to 'bar'
     */
    type?: 'bar' | 'point' | 'point-min-max';
}

const defaultDrawOptions: HistogramDrawOptions = {
    boxSymbols,
    histoChars: histoCharsLeftToRight,
};

export type DataLine =
    | readonly [label: string | number, value: number]
    | readonly [label: string | number, value: number, min: number, max: number];

export type Data = readonly DataLine[];

export function histogram(data: Data, options?: HistogramOptions): string {
    const {
        width = 80,
        maxLabelWidth: maxColumnWidth = Math.floor(width * 0.1),
        drawOptions: drawOptionsParam = defaultDrawOptions,
        title = '',
        min,
        max,
        showValues = true,
        significantDigits,
        type: chartType = 'bar',
        headers,
    } = { ...options };
    const { boxSymbols = defaultDrawOptions.boxSymbols, histoChars = defaultDrawOptions.histoChars } = {
        ...drawOptionsParam,
    };

    const showMinMax = chartType === 'point-min-max' && showValues;

    const [
        headerLabel = '',
        headerValue = 'Val',
        headerMin = (showMinMax && 'Min') || '',
        headerMax = (showMinMax && 'Max') || '',
    ] = headers ?? ['', '', '', ''];

    const vLine = boxSymbols[BoxSymbol.vertical];
    const hLine = boxSymbols[BoxSymbol.horizontal];
    const cross = boxSymbols[BoxSymbol.cross];

    const values = data.map(([, value]) => value);
    const labels = data.map(([label]) => String(label));
    const needMinMaxValues = chartType === 'point-min-max';
    const minValues = needMinMaxValues ? data.map(([, , min]) => min).filter((v): v is number => v !== undefined) : [];
    const maxValues = needMinMaxValues
        ? data.map(([, , , max]) => max).filter((v): v is number => v !== undefined)
        : [];
    const allValues = [...values, ...minValues, ...maxValues];
    const maxGraphValue = max ?? Math.max(...allValues);
    const minGraphValue = min ?? Math.min(0, ...allValues);
    const range = maxGraphValue - minGraphValue || 1;

    const valueToString = (value: number | undefined): string =>
        value === undefined
            ? ''
            : significantDigits !== undefined
              ? value.toFixed(significantDigits)
              : value.toString();
    const valuesToString = (values: number[]): string[] => values.map(valueToString);
    const calcColLabelLength = (label: string | undefined, values: string[]): number =>
        Math.min(Math.max(sLen(label), ...values.map(sLen)), maxColumnWidth);

    const colWidthLabel = calcColLabelLength(headerLabel, labels);
    const colWidthMin = calcColLabelLength(headerMin, valuesToString(minValues));
    const colWidthMax = calcColLabelLength(headerMax, valuesToString(maxValues));
    const colWidthValue = calcColLabelLength(headerValue, valuesToString(values));
    const colWidths = [colWidthLabel, colWidthValue, colWidthMin, colWidthMax].filter((v) => v > 0);

    const maxBarWidth = width - colWidths.reduce((a, b) => a + b, 0) - colWidths.length * 3 + 2;

    const barValue = (value: number): number =>
        (Math.max(Math.min(value, maxGraphValue), minGraphValue) - minGraphValue) / range;
    const colSep = ` ${vLine} `;
    const headerSep = `${hLine}${cross}${hLine}`;

    const lines = data.map(([label, value, minVal, maxVal]) => {
        const labelValue = formatColValue(String(label), colWidthLabel, false);
        const graphLine =
            chartType === 'bar'
                ? barHorizontal(barValue(value), maxBarWidth, ' ', histoChars)
                : chartType === 'point'
                  ? point(barValue(value), maxBarWidth, ' ')
                  : chartType === 'point-min-max'
                    ? pointMinMax(
                          barValue(value),
                          minVal !== undefined ? barValue(minVal) : undefined,
                          maxVal !== undefined ? barValue(maxVal) : undefined,
                          maxBarWidth,
                          ' ',
                      )
                    : '';

        const cols = [
            formatColValue(valueToString(value), colWidthValue, true),
            formatColValue(valueToString(minVal), colWidthMin, true),
            formatColValue(valueToString(maxVal), colWidthMax, true),
        ].filter((v) => !!v);
        return `${labelValue} ${vLine}${graphLine}${vLine} ${cols.join(colSep)}`;
    });

    function formatHeader(): string {
        if (!headers) return '';
        const label = formatColValue(headerLabel, colWidthLabel, false);
        const cols = [
            formatColValue(headerValue, colWidthValue, true),
            formatColValue(headerMin, colWidthMin, true),
            formatColValue(headerMax, colWidthMax, true),
        ].filter((v) => !!v);
        return (
            `${label} ${vLine}${' '.repeat(maxBarWidth)}${vLine} ${cols.join(colSep)}\n` +
            `${hLine.repeat(colWidthLabel + 1)}${cross}${hLine.repeat(maxBarWidth)}${cross}${hLine}${cols
                .map((s) => hLine.repeat(sLen(s)))
                .join(headerSep)}\n`
        );
    }

    const titleLine = title ? `${title}\n` : '';
    const headerLines = formatHeader();
    const table = `${titleLine}${headerLines}${lines.join('\n')}`;

    return table;
}

/**
 * Generate a point line for a value
 * @param value - between 0 and 1 inclusive.
 * @param width - the width of the graph in characters
 * @param padding - optional padding character, defaults to space.
 * @param pointChar - optional point character, defaults to `●`
 * @returns a string of the point
 */
export function point(value: number, width: number, padding = ' ', pointChar = '●'): string {
    const n = calc(value, width);
    return pointChar.padStart(n, padding).padEnd(width, padding);
}

function minMaxCap(value: number, min = 0, max = 1): number {
    return Math.max(Math.min(value, max), min);
}

function calc(value: number, width: number): number {
    const v = minMaxCap(value);
    return Math.floor(v * (width - 1) + 0.5);
}

const valueMinMaxSymbols = [
    '●',
    boxSymbols[BoxSymbol.leftT],
    boxSymbols[BoxSymbol.horizontal],
    boxSymbols[BoxSymbol.rightT],
] as const;

/**
 *
 * @param value - between 0 and 1 inclusive.
 * @param minVal - the minimum value, defaults to the value
 * @param maxVal - the maximum value, defaults to the value
 * @param width - the width of the graph in characters
 * @param padding - optional padding character, defaults to space.
 * @param symbols - the symbols to use for the min, max, and value, defaults to `['●', '┣', '━', '┫']`
 * @returns
 */
export function pointMinMax(
    value: number,
    minVal: number | undefined,
    maxVal: number | undefined,
    width: number,
    padding: string = ' ',
    symbols: readonly string[] = valueMinMaxSymbols,
): string {
    const line = [...padding.repeat(width)];
    const val = calc(value, width);
    const min = calc(minVal ?? value, width);
    const max = calc(maxVal ?? value, width);
    line[min] = symbols[1];
    line[max] = symbols[3];
    for (let i = min + 1; i < max; i++) {
        line[i] = symbols[2];
    }
    line[val] = symbols[0];
    return line.join('');
}

function sLen(s: string | undefined): number {
    if (s === undefined) return 0;
    return [...s].length;
}

function sliceStr(s: string, start: number, end: number): string {
    return [...s].slice(start, end).join('');
}

function formatColValue(s: string, width: number, padStart: boolean, padding: string = ' '): string {
    const ss = sliceStr(s, 0, width);
    return padStart ? ss.padStart(width, padding) : ss.padEnd(width, padding);
}
