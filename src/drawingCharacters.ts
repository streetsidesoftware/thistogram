export enum BoxSymbol {
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,
    vertical,
    horizontal,
    leftT,
    rightT,
    bottomT,
    topT,
    cross,
}

/**
 * The characters used to draw the box plot.
 * top-left, top-right, bottom-right, bottom-left, vertical, horizontal, left-T, right-T, bottom-T, top-T, cross
 */
export const boxSymbols: string[] = ['┏', '┓', '┛', '┗', '┃', '━', '┣', '┫', '┻', '┳', '╋'];

export const histoCharsBottomToTop: string[] = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

export const histoCharsLeftToRight: string[] = ['▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];
