import { SymbolType, SymbolTypeOrText } from "../symbolTable/types";
import { Symbol } from "../symbolTable";
import { TokenType } from "./types";

export class Token {
  readonly symbol: Symbol;

  constructor(type: "linebreak");
  constructor(type: "symbol", value: SymbolType, symbol: Symbol);
  constructor(type: "text" | "listnumber", value: string, symbol: Symbol);
  constructor(type: TokenType, value: string, symbol: Symbol);
  constructor(
    readonly type: TokenType,
    readonly value: string = "",
    symbol?: Symbol
  ) {
    if (type === "linebreak") {
      this.value = "\\n";
      this.symbol = new Symbol("\\n", false);
    } else if (symbol !== undefined) {
      this.symbol = symbol;
    } else {
      throw new Error(`Must provide a symbol for token of type ${type}`);
    }
  }

  static TokenTypeFromSymbolType(symbolType: SymbolTypeOrText): TokenType {
    if (symbolType === "text") return "text";
    else if (symbolType === "\\n") return "linebreak";
    return "symbol";
  }
}

export class Tokenizer {
  readonly tokens: Token[] = [];
  constructor(readonly code: string[]) {
    this.GetTokens();
  }

  private GetTokens() {
    let lineTokenizer: LineTokenizer;
    for (const line of this.code) {
      lineTokenizer = new LineTokenizer(line);

      for (const token of lineTokenizer.tokens) {
        this.tokens.push(token);
      }

      this.tokens.push(new Token("linebreak"));
    }
  }
}

class LineTokenizer {
  readonly tokens: Token[] = [];
  constructor(readonly line: string) {
    this.tokens = this.SymbolsToTokens(this.GetSymbols());
  }

  private GetSymbols(): Symbol[] {
    const symbArr: Symbol[] = [];

    let isEscaped = false;
    for (let char of this.line) {
      const symbol = new Symbol(char, isEscaped);

      if (symbol.isEscapeSymbol) {
        isEscaped = true;
        continue;
      }

      if (isEscaped && !symbol.isEscapable) {
        //If the character isn't escapable, treat the escape symbol as a regular symbol
        symbArr.push(new Symbol("\\", true));
      }

      symbArr.push(symbol);
      isEscaped = false;
    }

    return symbArr;
  }

  private SymbolsToTokens(symbols: Symbol[]): Token[] {
    const tokenAssembler = new TokenAssembler();

    for (const symbol of symbols) {
      tokenAssembler.AddSymbol(symbol);
    }

    return tokenAssembler.GetTokens();
  }
}

class TokenAssembler {
  private tokenArr: Token[] = [];
  private currType: SymbolTypeOrText | undefined = undefined;
  private currValue: string = "";

  private get currLength(): number {
    return this.currValue.length;
  }

  AddSymbol(symbol: Symbol) {
    if (this.StartsNewToken(symbol)) this.PushToken();
    if (this.currType === undefined) this.currType = symbol.symbolType;

    this.currValue += symbol.content;
  }

  GetTokens(): Token[] {
    this.PushToken();
    return this.tokenArr;
  }

  private PushToken() {
    if (this.currType !== undefined && this.currValue !== "") {
      this.tokenArr.push(
        new Token(
          Token.TokenTypeFromSymbolType(this.currType),
          this.currValue,
          new Symbol(this.currValue[0], false)
        )
      );
    }

    this.currType = undefined;
    this.currValue = "";
  }

  private StartsNewToken(symbol: Symbol) {
    return (
      this.currType !== symbol.symbolType ||
      this.currLength >= symbol.maxMatches
    );
  }
}
