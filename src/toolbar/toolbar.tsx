import React from "react";
import {
  ButtonToolbar,
  ButtonGroup,
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import { MdToolbarProps } from "./types";
import { mdToolbarButtons } from "./toolbarButtons";

export const MdToolbar = ({
  textSelected,
  ToolbarButtonHandler,
}: MdToolbarProps) => (
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
