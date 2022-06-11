import React, { useState } from "react";
import MapIcon from "@mui/icons-material/Map";
import { Box, Button, Collapse, ToggleButton } from "@mui/material";
import { ResMap as MapWithDraw } from "./MapWithDraw";

type Props = {
    selectedArea?: any;
    filters: any;
    onSelectedAreaChange: Function;
};

function CollapsableMap({filters,selectedArea, onSelectedAreaChange}: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box>
      <Box sx={{ position: "fixed", top: "94px", right: "60px", zIndex: 1 }}>
        <ToggleButton
          size="small"
          value="check"
          selected={expanded}
          onChange={() => setExpanded((x) => !x)}
        >
          <MapIcon />
        </ToggleButton>
      </Box>
      <Collapse in={expanded} orientation="horizontal" sx={{ height: "100%" }}>
        <Box sx={{ height: "100%", width: "420px" }}>
          <MapWithDraw selectedArea={filters?.selectedArea} onSelectedAreaChange={onSelectedAreaChange} />
        </Box>
      </Collapse>
    </Box>
  );
}

export default CollapsableMap;
