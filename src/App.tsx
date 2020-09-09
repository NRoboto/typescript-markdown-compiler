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
};

const mdToolbarButtons: MdToolbarButtonItem[][] = [
  [
    { label: "h1", tooltip: "Add title" },
    { label: "h2", tooltip: "Add subtitle" },
    { label: "h3", tooltip: "Add subsubtitle" },
  ],
  [
    {
      label: "bold",
      tooltip: "Make selected text bold",
      requiresSelectedText: true,
    },
    {
      label: "italic",
      tooltip: "Make selected text italic",
      requiresSelectedText: true,
    },
    {
      label: "code",
      tooltip: "Make selected text into code",
      requiresSelectedText: true,
    },
  ],
  [{ label: "hr", tooltip: "Add a horizontal rule" }],
];

type MdToolbarProps = {
  textSelected: boolean;
};

const MdToolbar = ({ textSelected }: MdToolbarProps) => (
  <ButtonToolbar className="mb-2">
    {mdToolbarButtons.map((group, groupID) => (
      <ButtonGroup key={groupID}>
        {group.map((item, itemID) => (
          <>
            <Button
              id={`toolbar-tooltip-${groupID}-${itemID}`}
              disabled={item.requiresSelectedText && !textSelected}
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

type SelectedInputPos =
  | { selectionStart: number; selectionEnd: number }
  | undefined;

const App = () => {
  const [mdInput, setMdInput] = React.useState("");
  const [mdOutput, setMdOutput] = React.useState("");
  const [selectedInput, setSelectedInput] = React.useState<SelectedInputPos>();

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
      setSelectedInput(undefined);
    else
      setSelectedInput({
        selectionStart,
        selectionEnd,
      });
  };

  React.useEffect(() => {
    const compiler = new Compiler(mdInput);
    setMdOutput(compiler.compiled);
  }, [mdInput]);

  return (
    <Container className="h-100" fluid>
      <Row className="h-100">
        <Panel className="shadow-sm">
          <MdToolbar textSelected={selectedInput !== undefined} />
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
