import { precompilerRules } from "./rules";
import { InRange } from "../../common";

export class Precompiler {
  private _output: string;
  public get output(): string {
    return this._output;
  }

  constructor(input: string, sanitizeHTML: boolean) {
    this._output = input;

    if (sanitizeHTML) this.SanitizeHTML();
    this.ApplyRules();
  }

  private ApplyRules() {
    const codeLines = this._output.split(/\r?\n/);
    const linesToRemove: number[] = [];

    codeLines.forEach((line, i) => {
      for (const rule of precompilerRules) {
        const targetLineIndex = i + rule.targetLineRelative;
        if (!InRange(targetLineIndex, 0, codeLines.length - 1)) continue;

        const targetLine = codeLines[targetLineIndex];
        if (rule.prevLineMustBeBlank && codeLines[targetLineIndex - 1] != "")
          continue;
        if (!rule.lineMatch.exec(line)) continue;

        codeLines[targetLineIndex] = rule.targetLineModifier(targetLine);
        if (rule.targetLineRelative !== 0) linesToRemove.push(i);
        break;
      }
    });

    this._output = codeLines
      .filter((_, i) => !linesToRemove.includes(i))
      .join("\n");
  }

  private SanitizeHTML() {
    this._output = this._output
      .replace(/&/g, "&nbsp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
