import { SymbolType, SymbolTypeOrText } from "../symbolTable/types";
import { Symbol } from "../symbolTable";

type TokenType = "symbol" | "text" | "listnumber" | "linebreak";

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

  static TokenFromSymbols() {}

  static TokenTypeFromSymbolType(symbolType: SymbolTypeOrText): TokenType {
    if (symbolType === "text") return "text";
    else if (symbolType === "\\n") return "linebreak";
    return "symbol";
  }
}

export class Tokenizer {
  readonly tokens = this.TokenGenerator();
  constructor(readonly code: string[]) {}

  private *TokenGenerator() {
    let lineTokenizer: LineTokenizer;
    for (const line of this.code) {
      lineTokenizer = new LineTokenizer(line);

      for (const token of lineTokenizer.tokens) {
        yield token;
      }

      yield new Token("linebreak");
    }
  }
}

class LineTokenizer {
  readonly tokens = this.GetTokens();
  constructor(readonly line: string) {}

  private GetTokens(): Token[] {
    return this.SymbolsToTokens(this.GetSymbols());
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
    const tokenArr: Token[] = [];
    let currType: SymbolTypeOrText | undefined = undefined;
    let currValue: string = "";

    const PushCurrent = () => {
      if (currType !== undefined && currValue !== "") {
        const symbol = new Symbol(currValue[0], false);
        tokenArr.push(
          new Token(Token.TokenTypeFromSymbolType(currType), currValue, symbol)
        );
      }
    };

    for (const symbol of symbols) {
      if (currType === undefined) currType = symbol.symbolType;

      if (
        currType !== symbol.symbolType ||
        currValue.length >= symbol.maxMatches
      ) {
        PushCurrent();
        currValue = "";
        currType = symbol.symbolType;
      }

      currValue += symbol.content;
    }

    PushCurrent();
    return tokenArr;
  }
}
