/**
 * Returns a function which wraps `str` with `tagContent`.
 * @example surroundWithTags("h1")("test") === "<h1>test</h1>"
 * @return A function to wrap a string in tags.
 */
export const SurroundWithTags = (tagContent: string) => (str: string) =>
  `<${tagContent}>${str}</${tagContent}>`;

/**
 * Is `value` less than or equal to `upperBound` and greater than or equal
 * to `lowerBound`?
 */
export const InRange = (
  value: number,
  lowerBound: number,
  upperBound: number
) => value <= upperBound && value >= lowerBound;
