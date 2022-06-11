import React, { useState } from "react";
import MapIcon from "@mui/icons-material/Map";
import { Box, Button, Collapse, ToggleButton } from "@mui/material";
import { ResMap as MapWithDraw } from "./MapWithDraw";
import { Restaurant } from "src/types/Resturants";

type Props = {
  filters: any;
  onFiltersChange: Function;
  selectedRestaurant?: Restaurant;
};

function CollapsableMap({
  filters,
  onFiltersChange,
  selectedRestaurant,
}: Props) {
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
          <MapWithDraw
            filters={filters}
            onFiltersChange={onFiltersChange}
            selectedRestaurant={selectedRestaurant}
          />
        </Box>
      </Collapse>
    </Box>
  );
}

export default CollapsableMap;
