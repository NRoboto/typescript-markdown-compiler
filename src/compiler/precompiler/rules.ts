import { PrecompilerRule } from "./types";

export const precompilerRules: PrecompilerRule[] = [
  {
    lineMatch: /^-{3,}$/,
    targetLineRelative: 0,
    targetLineModifier: (_line) => `<hr/>`,
    prevLineMustBeBlank: true,
  },
  {
    lineMatch: /^-{3,}$/,
    targetLineRelative: -1,
    targetLineModifier: (line) => `# ${line}`,
  },
  {
    lineMatch: /^={3,}$/,
    targetLineRelative: -1,
    targetLineModifier: (line) => `## ${line}`,
  },
];
