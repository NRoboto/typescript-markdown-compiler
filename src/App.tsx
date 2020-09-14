import React from "react";
import { Col, Input, Container, Card, CardBody, Row } from "reactstrap";
import { PanelProps } from "./types";
import { Compiler } from "./compiler";
import { MdToolbar, MdToolbarButtonItem } from "./toolbar";
import { GetLineByIndex, ReplaceTextSection } from "./common";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const Panel = ({ className, children }: PanelProps) => (
  <Col xs="12" md="6" className="my-2 h-md-100">
    <Card className={`h-100 ${className}`}>
      <CardBody className="d-flex flex-column">{children}</CardBody>
    </Card>
  </Col>
);

export class TextSelection {
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
    if (!selectedInput.isSelection) return;

    if (buttonItem.SelectionReplacer) {
      setMdInput(
        ReplaceTextSection(
          mdInput,
          selectedInput.selectionStart!,
          selectedInput.selectionEnd!,
          buttonItem.SelectionReplacer(selectedInput.selectedText)
        )
      );
    }

    if (buttonItem.LineReplacer) {
      const currLine = GetLineByIndex(mdInput, selectedInput.cursorPos);

      setMdInput(
        ReplaceTextSection(
          mdInput,
          currLine.prevLineBreakIndex,
          currLine.nextLinebreakIndex,
          buttonItem.LineReplacer(
            mdInput.slice(
              currLine.prevLineBreakIndex,
              currLine.nextLinebreakIndex
            ),
            selectedInput
          )
        )
      );
    }

    if (buttonItem.InputReplacer)
      setMdInput(buttonItem.InputReplacer(mdInput, selectedInput));
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
