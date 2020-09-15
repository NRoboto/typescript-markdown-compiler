export type PrecompilerRule = {
  lineMatch: RegExp;
  targetLineRelative: number;
  targetLineModifier: (line: string) => string;
  prevLineMustBeBlank?: boolean;
};
