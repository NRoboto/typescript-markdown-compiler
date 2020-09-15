import {
  SymbolType,
  SymbolElement,
  SymbolTypeOrText,
  ASTNodeType,
  ASTElement,
} from "./types";

export const symbolTable: Record<SymbolType, SymbolElement> = {
  "#": {
    maxMatches: 6,
    escapable: true,
    newLineCloses: true,
    hasChildren: true,
  },
  "*": {
    maxMatches: 1,
    escapable: true,
    hasChildren: true,
    matchCloses: true,
  },
  ">": {
    maxMatches: 1,
    escapable: false,
    newLineCloses: true,
    hasChildren: true,
  },
  "-": {
    maxMatches: 1,
    escapable: true,
    newLineCloses: true,
    hasChildren: true,
  },
  "`": {
    maxMatches: 1,
    escapable: true,
    hasChildren: true,
    matchCloses: true,
  },
  "  ": {
    maxMatches: 1,
    escapable: false,
    hasChildren: false,
  },
  "\\": {
    escapable: true,
    hasChildren: false,
  },
  "\\n": {
    maxMatches: 1,
    escapable: true,
    hasChildren: false,
  },
};

export const astTable: Record<ASTNodeType, ASTElement> = {
  heading: {
    htmlTagGenerator: (node) => `h${node.count}`,
  },
  boldit: {
    htmlTagGenerator: (node) =>
      node.count >= 3
        ? ["strong", "emph"]
        : node.count === 2
        ? "strong"
        : "emph",
  },
  blockquote: {
    htmlTagGenerator: (_node) => "blockquote",
  },
  olistelement: {
    htmlTagGenerator: (_node) => "ol",
  },
  ulistelement: {
    htmlTagGenerator: (_node) => "li",
  },
  code: {
    htmlTagGenerator: (_node) => "code",
  },
  text: {
    htmlTagGenerator: (_node) => "",
  },
  newline: {
    htmlTagGenerator: (_node) => "br",
    tagIsSelfClosing: true,
  },
  hr: {
    htmlTagGenerator: (node) => `hr${node.count}`,
    tagIsSelfClosing: true,
  },
  markdown: {
    htmlTagGenerator: (_node) => "div",
  },
};

export class Symbol {
  readonly content: string;
  readonly symbolElement: SymbolElement | undefined;
  readonly isSymbol: boolean;
  readonly symbolType: SymbolTypeOrText;
  readonly isEscapeSymbol: boolean;
  readonly isEscapable: boolean;
  readonly maxMatches: number;

  constructor(char: string, isEscaped: boolean) {
    this.content = char;
    if (this.content.length !== 1 && this.content !== "\\n")
      throw new Error(
        "A symbol should consist of only one character or be a new line."
      );

    this.symbolElement = symbolTable[this.content as SymbolType];
    this.isSymbol = this.symbolElement !== undefined;
    this.isEscapable = this.isSymbol ? this.symbolElement.escapable : true;
    this.symbolType = this.GetSymbolType(isEscaped);
    this.isEscapeSymbol = this.symbolType === "\\" && !isEscaped;
    this.maxMatches = this.isSymbol
      ? this.symbolElement.maxMatches ?? 9999
      : 9999;
  }

  private GetSymbolType(isEscaped: boolean) {
    if ((!isEscaped || !this.isEscapable) && this.isSymbol)
      return this.content as SymbolType;
    return "text";
  }
}
