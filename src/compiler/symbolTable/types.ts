export type SymbolType = "#" | "*" | ">" | "-" | "`" | "\\" | "  " | "\\n";
export type SymbolTypeOrText = SymbolType | "text";

export type SymbolElement = {
  maxMatches?: number;
  escapable: boolean;
  newLineCloses?: boolean;
  matchCloses?: boolean;
  hasChildren: boolean;
};

export type ASTNodeType =
  | "heading"
  | "bold"
  | "italic"
  | "blockquote"
  | "olistelement"
  | "ulistelement"
  | "code"
  // | "link"
  // | "image"
  | "text"
  | "newline"
  | "hr"
  | "markdown";

export type ASTElement = {
  htmlTagContent: string;
};
