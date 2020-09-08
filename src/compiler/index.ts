import { Tokenizer, Token } from "./tokenizer";
import { SyntacticAnalyser } from "./syntacticAnalyser";
import { Transformer } from "./transformer";
import { CodeGenerator } from "./codeGenerator";

export class Compiler {
  readonly compiled: string = "";

  constructor(readonly input: string) {
    const tokenizer = new Tokenizer(input.split(/\r?\n/));
    const syntacticAnalyser = new SyntacticAnalyser(tokenizer.tokens);
    const transformer = new Transformer(syntacticAnalyser.rootNode);
    const codeGenerator = new CodeGenerator(transformer.astRoot);
    this.compiled = codeGenerator.html;
  }
}
