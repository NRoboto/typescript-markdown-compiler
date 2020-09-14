import { MdToolbarButtonItem } from "./types";
import { GetLineByIndex } from "../common";

export const mdToolbarButtons: MdToolbarButtonItem[][] = [
  [
    { label: "h1", tooltip: "Add title", LineReplacer: (line) => `# ${line}` },
    {
      label: "h2",
      tooltip: "Add subtitle",
      LineReplacer: (line) => `## ${line}`,
    },
    {
      label: "h3",
      tooltip: "Add subsubtitle",
      LineReplacer: (line) => `### ${line}`,
    },
  ],
  [
    {
      label: "bold",
      tooltip: "Make selected text bold",
      requiresSelectedText: true,
      SelectionReplacer: (selection) => `**${selection}**`,
    },
    {
      label: "italic",
      tooltip: "Make selected text italic",
      requiresSelectedText: true,
      SelectionReplacer: (selection) => `*${selection}*`,
    },
    {
      label: "code",
      tooltip: "Make selected text into code",
      requiresSelectedText: true,
      SelectionReplacer: (selection) => `\`${selection}\``,
    },
  ],
  [
    {
      label: "hr",
      tooltip: "Add a horizontal rule",
      InputReplacer: (input, selectedPos) => {
        const newLinePos =
          GetLineByIndex(input, selectedPos.cursorPos).nextLinebreakIndex + 1;
        if (newLinePos === -1) return input;
        const [beforeLinebreak, afterLinebreak] = [
          input.slice(0, newLinePos),
          input.slice(newLinePos),
        ];
        return `${beforeLinebreak}\n---\n${afterLinebreak}`;
      },
    },
  ],
];
