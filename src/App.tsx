import React from "react";
import {
  Col,
  Input,
  Container,
  Card,
  CardBody,
  Row,
  ButtonToolbar,
  ButtonGroup,
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import { PanelProps } from "./types";
import { Compiler } from "./compiler";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const Panel = ({ className, children }: PanelProps) => (
  <Col xs="12" md="6" className="my-2 h-md-100">
    <Card className={`h-100 ${className}`}>
      <CardBody className="d-flex flex-column">{children}</CardBody>
    </Card>
  </Col>
);

type MdToolbarButtonItem = {
  label: string;
  tooltip: string;
  requiresSelectedText?: boolean;
  SelectionReplacer?: (selection: string) => string;
  LineReplacer?: (line: string, selectedLinePos: TextSelection) => string;
  InputReplacer?: (input: string, selectedInputPos: TextSelection) => string;
};

const mdToolbarButtons: MdToolbarButtonItem[][] = [
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
        const newLinePos = input.indexOf(
          "\\n",
          selectedPos?.selectionEnd ?? input.length
        );
        if (newLinePos === -1) return input;
        const [beforeLinebreak, afterLinebreak] = [
          input.slice(0, newLinePos),
          input.slice(newLinePos),
        ];
        return `${beforeLinebreak}\\n\\n---\\n${afterLinebreak}`;
      },
    },
  ],
];

type MdToolbarProps = {
  textSelected: boolean;
  ToolbarButtonHandler: (toolbarButtonItem: MdToolbarButtonItem) => void;
};

const MdToolbar = ({ textSelected, ToolbarButtonHandler }: MdToolbarProps) => (
  <ButtonToolbar className="mb-2">
    {mdToolbarButtons.map((group, groupID) => (
      <ButtonGroup key={groupID}>
        {group.map((item, itemID) => (
          <>
            <Button
              id={`toolbar-tooltip-${groupID}-${itemID}`}
              disabled={item.requiresSelectedText && !textSelected}
              onClick={() => ToolbarButtonHandler(item)}
            >
              {item.label}
            </Button>
            <UncontrolledTooltip
              target={`toolbar-tooltip-${groupID}-${itemID}`}
            >
              {item.tooltip}
            </UncontrolledTooltip>
          </>
        ))}
      </ButtonGroup>
    ))}
  </ButtonToolbar>
);

class TextSelection {
  public get isSelection(): boolean {
    return (
      this.selectionStart !== undefined &&
      this.selectionEnd !== undefined &&
      this.selectedText !== ""
    );
  }
  constructor(
    readonly cursorPos: number = 0,
    readonly selectedText: string = "",
    readonly selectionStart?: number,
    readonly selectionEnd?: number
  ) {}
}

const App = () => {
  const [mdInput, setMdInput] = React.useState("");
  const [mdOutput, setMdOutput] = React.useState("");
  const [selectedInput, setSelectedInput] = React.useState(new TextSelection());

  const OnInputSelect = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputEle = event.target as HTMLInputElement;
    const [selectionStart, selectionEnd] = [
      inputEle.selectionStart,
      inputEle.selectionEnd,
    ];

    if (
      selectionStart === null ||
      selectionEnd === null ||
      selectionStart === selectionEnd
    )
      setSelectedInput(new TextSelection());
    else
      setSelectedInput(
        new TextSelection(
          selectionEnd,
          mdInput.slice(selectionStart, selectionEnd),
          selectionStart,
          selectionEnd
        )
      );
  };

  const InputReplaceHandler = (buttonItem: MdToolbarButtonItem) => {
    }
  };

  React.useEffect(() => {
    const compiler = new Compiler(mdInput);
    setMdOutput(compiler.compiled);
  }, [mdInput]);

  return (
    <Container className="h-100" fluid>
      <Row className="h-100">
        <Panel className="shadow-sm">
          <MdToolbar
            textSelected={selectedInput !== undefined}
            ToolbarButtonHandler={InputReplaceHandler}
          />
          <Input
            type="textarea"
            name="md-input"
            className="flex-fill"
            style={{ resize: "none" }}
            onChange={(event) => setMdInput(event.target.value)}
            onSelect={OnInputSelect}
            value={mdInput}
            autoFocus
          ></Input>
        </Panel>
        <Panel className="shadow-sm">
          <p id="md-output" dangerouslySetInnerHTML={{ __html: mdOutput }}></p>
        </Panel>
      </Row>
    </Container>
  );
};

export default App;
