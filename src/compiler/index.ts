import { Tokenizer } from "./tokenizer";

export class Compiler {
  readonly compiled: string = "";

  constructor(readonly input: string) {
    const tokenizer = new Tokenizer(input.split(/\r?\n/));
    for (
      let token = tokenizer.tokens.next();
      !token.done;
      token = tokenizer.tokens.next()
    ) {
      this.compiled += `{${token.value.type}, ${token.value.value}}, `;
    }
  }
}
