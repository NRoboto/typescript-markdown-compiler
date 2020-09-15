import React from "react";
import {
  ButtonToolbar,
  ButtonGroup,
  Button,
  UncontrolledTooltip,
  Row,
  Col,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import { MdToolbarProps } from "./types";
import { mdToolbarButtons } from "./toolbarButtons";

export const MdToolbar = ({
  textSelected,
  sanitizeHTML,
  ToolbarButtonHandler,
  SanitizeCheckHandler,
}: MdToolbarProps) => (
  <Row>
    <Col xl="9" xs="12">
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
    </Col>
    <Col xl="3" xs="12">
      <FormGroup check inline>
        <Label check>
          <Input
            type="checkbox"
            checked={sanitizeHTML}
            onClick={() => SanitizeCheckHandler(!sanitizeHTML)}
          />
          Sanitize HTML?
        </Label>
      </FormGroup>
    </Col>
  </Row>
);
