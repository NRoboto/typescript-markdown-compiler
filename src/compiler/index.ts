import { Tokenizer } from "./tokenizer";
import { SyntacticAnalyser } from "./syntacticAnalyser";
import { Transformer } from "./transformer";
import { CodeGenerator } from "./codeGenerator";
import { Precompiler } from "./precompiler";

export class Compiler {
  readonly compiled: string = "";

  constructor(readonly input: string, readonly sanitizeHTML: boolean) {
    const precompiler = new Precompiler(input, sanitizeHTML);
    const tokenizer = new Tokenizer(precompiler.output.split(/\r?\n/));
    const syntacticAnalyser = new SyntacticAnalyser(tokenizer.tokens);
    const transformer = new Transformer(syntacticAnalyser.rootNode);
    const codeGenerator = new CodeGenerator(transformer.astRoot);
    this.compiled = codeGenerator.html;
  }
}
