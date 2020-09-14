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

export const GetLineByIndex = (input: string, index: number) => {
  const inputLines = input.split(/\r?\n/);
  let [prevLineBreakIndex, nextLinebreakIndex]: [number, number] = [0, 0];
  let line: string = "";
  for (line of inputLines) {
    nextLinebreakIndex = prevLineBreakIndex + line.length;

    if (index >= prevLineBreakIndex && index <= nextLinebreakIndex) break;
    prevLineBreakIndex = nextLinebreakIndex + 1;
  }

  return {
    line,
    prevLineBreakIndex,
    nextLinebreakIndex,
  };
};

export const ReplaceTextSection = (
  text: string,
  begin: number,
  end: number,
  newText: string
) => text.slice(0, begin) + newText + text.slice(end);
