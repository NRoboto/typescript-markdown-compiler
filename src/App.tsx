import React from "react";
import { Col, Input, Container, Card, CardBody, Row, Button } from "reactstrap";
import { PanelProps } from "./types";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const Panel = ({ children }: PanelProps) => (
  <Col xs="12" md="6" className="my-2 h-md-100">
    <Card className="h-100">
      <CardBody>{children}</CardBody>
    </Card>
  </Col>
);

const App = () => (
  <Container className="h-100" fluid>
    <Row className="h-100">
      <Panel>
        <Input type="textarea" name="md-input" className="h-100"></Input>
      </Panel>
      <Panel>
        <p id="md-output">Test output!</p>
      </Panel>
    </Row>
  </Container>
);

export default App;
