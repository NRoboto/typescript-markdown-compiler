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
  readonly selectedText: string;
  public get isSelection(): boolean {
    return this.selectionStart !== this.selectionEnd;
  }
  constructor(
    readonly cursorPos: number = 0,
    readonly selectionStart?: number,
    readonly selectionEnd?: number,
    readonly inputText: string = ""
  ) {
    this.selectedText = inputText.slice(selectionStart, selectionEnd);
  }
}

const App = () => {
  const [mdInput, setMdInput] = React.useState("");
  const [mdOutput, setMdOutput] = React.useState("");
  const [selectedInput, setSelectedInput] = React.useState(new TextSelection());

  const OnInputSelect = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const inputEle = event.target as HTMLInputElement;
    setSelectedInput(
      new TextSelection(
        inputEle.selectionStart ?? undefined,
        inputEle.selectionStart ?? undefined,
        inputEle.selectionEnd ?? undefined,
        mdInput
      )
    );
  };

  const InputReplaceHandler = (buttonItem: MdToolbarButtonItem) => {
    if (buttonItem.requiresSelectedText && !selectedInput.isSelection) return;

    if (buttonItem.SelectionReplacer) {
      if (
        selectedInput.selectionStart === undefined ||
        selectedInput.selectionEnd === undefined
      )
        return;

      setMdInput(
        ReplaceTextSection(
          mdInput,
          selectedInput.selectionStart,
          selectedInput.selectionEnd,
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
          buttonItem.LineReplacer(currLine.line, selectedInput)
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
            textSelected={selectedInput.isSelection}
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
