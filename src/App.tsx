import React from "react";
import { Col, Input, Container, Card, CardBody, Row } from "reactstrap";
import { PanelProps } from "./types";
import { Compiler } from "./compiler";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const Panel = ({ children }: PanelProps) => (
  <Col xs="12" md="6" className="my-2 h-md-100">
    <Card className="h-100">
      <CardBody>{children}</CardBody>
    </Card>
  </Col>
);

const App = () => {
  const [mdInput, setMdInput] = React.useState("");
  const [mdOutput, setMdOutput] = React.useState("");

  React.useEffect(() => {
    const compiler = new Compiler(mdInput);
    setMdOutput(compiler.compiled);
  }, [mdInput]);

  return (
    <Container className="h-100" fluid>
      <Row className="h-100">
        <Panel>
          <Input
            type="textarea"
            name="md-input"
            className="h-100"
            onChange={(event) => setMdInput(event.target.value)}
            value={mdInput}
          ></Input>
        </Panel>
        <Panel>
          <p id="md-output" dangerouslySetInnerHTML={{ __html: mdOutput }}></p>
        </Panel>
      </Row>
    </Container>
  );
};

export default App;
