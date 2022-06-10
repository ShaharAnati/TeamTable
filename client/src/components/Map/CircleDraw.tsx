import React from "react";
import { useControl } from "react-map-gl";
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode,
} from "mapbox-gl-draw-circle";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

type Props = {};

function CircleDraw({}: Props) {
  useControl(
    () => {
      const draw = new MapboxDraw({
        defaultMode: "drag_circle",
        userProperties: true,
        displayControlsDefault: false,
        controls: {
          trash: true,
        },
        modes: {
          ...MapboxDraw.modes,
          draw_circle: CircleMode,
          drag_circle: DragCircleMode,
          direct_select: DirectMode,
          simple_select: SimpleSelectMode,
        },
      });

      return draw;
    },
    {
      position: "top-right",
    }
  );

  return null;
}

export default CircleDraw;
