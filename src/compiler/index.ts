import { Tokenizer, Token } from "./tokenizer";
import { SyntacticAnalyser } from "./syntacticAnalyser";
import { Transformer } from "./transformer";
import { CodeGenerator } from "./codeGenerator";

export class Compiler {
  readonly compiled: string = "";

  constructor(readonly input: string) {
    const tokenizer = new Tokenizer(input.split(/\r?\n/));
    const tokens: Token[] = tokenizer.tokens;

    const syntacticAnalyser = new SyntacticAnalyser(tokens);

    const transformer = new Transformer(syntacticAnalyser.rootNode);

    const codeGenerator = new CodeGenerator(transformer.astRoot);
    console.log(codeGenerator.html);
    this.compiled = codeGenerator.html;
  }
}
