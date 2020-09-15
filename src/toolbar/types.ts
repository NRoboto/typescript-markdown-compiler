import { TextSelection } from "../App";

export type MdToolbarProps = {
  textSelected: boolean;
  sanitizeHTML: boolean;
  ToolbarButtonHandler: (toolbarButtonItem: MdToolbarButtonItem) => void;
  SanitizeCheckHandler: (checked: boolean) => void;
};

export type MdToolbarButtonItem = {
  label: string;
  tooltip: string;
  requiresSelectedText?: boolean;
  SelectionReplacer?: (selection: string) => string;
  LineReplacer?: (line: string, selectedLinePos: TextSelection) => string;
  InputReplacer?: (input: string, selectedInputPos: TextSelection) => string;
};
