/**
 * Calculate the standard deviation of a list of numbers
 * @param values - List of numbers
 * @returns the standard deviation of the list of numbers, NaN if the list is empty.
 */
export function calcStandardDeviation(values: readonly number[]): number {
    const variance = calcVariance(values);
    return Math.sqrt(variance);
}

/**
 * Calculate the mean of a list of numbers
 * @param values - List of numbers
 * @returns the mean of the list of numbers, NaN if the list is empty.
 */
export function calcMean(values: readonly number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Calculate the variance of a list of numbers
 * @param values - List of numbers
 * @param mean - optional mean of the list of numbers, otherwise it will be calculated.
 * @returns the variance of the list of numbers, NaN if the list is empty.
 */
export function calcVariance(values: readonly number[], mean?: number): number {
    const avg = mean ?? calcMean(values);
    return values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
}

/**
 * Calculate the median of a list of numbers
 * @param values - List of numbers
 * @returns the median of the list of numbers, NaN if the list is empty.
 */
export function calcMedian(values: readonly number[]): number {
    values = [...values].sort((a, b) => a - b);
    const length = values.length;
    const remainder = length & 1;
    const half = length >> 1;
    return (values[half - 1 + remainder] + values[half]) / 2;
}
