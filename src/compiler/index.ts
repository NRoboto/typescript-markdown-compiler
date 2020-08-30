import { Tokenizer, Token } from "./tokenizer";
import { SyntacticAnalyser } from "./syntacticAnalyser";

export class Compiler {
  readonly compiled: string = "";

  constructor(readonly input: string) {
    const tokenizer = new Tokenizer(input.split(/\r?\n/));
    const tokens: Token[] = tokenizer.tokens;

    for (const token of tokens) {
      this.compiled += `{${token.type}, ${token.value}}, `;
    }

    const syntacticAnalyser = new SyntacticAnalyser(tokens);

    console.log(syntacticAnalyser.rootNode);
  }
}
