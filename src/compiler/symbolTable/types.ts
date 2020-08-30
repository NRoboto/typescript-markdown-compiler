export type SymbolType = "#" | "*" | ">" | "-" | "`" | "\\" | "  " | "\\n";

export type SymbolElement = {
  maxMatches?: number;
  escapable: boolean;
  newLineCloses?: boolean;
  matchCloses?: boolean;
  hasChildren: boolean;
};

export type SymbolTypeOrText = SymbolType | "text";
