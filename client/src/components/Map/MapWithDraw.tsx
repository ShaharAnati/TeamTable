import React, { useEffect, useRef, useState } from "react";
import MapGL, { MapRef, setRTLTextPlugin } from "react-map-gl";
import maplibregl from "maplibre-gl";
import {
  Editor,
  DrawCircleFromCenterMode,
  EditingMode,
} from "react-map-gl-draw";
import "maplibre-gl/dist/maplibre-gl.css";

setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
  null,
  true
);

const DEFAULT_VIEWPORT = {
  longitude: 34.77876808975043,
  latitude: 32.071869249621386,
  zoom: 13,
};

export const ResMap = (props) => {
  const mapRef = useRef<MapRef>();
  const editorRef = useRef<any>()!;

  const [localFeatures, setLocalFeatures] = useState([]);

  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [modeHandler, setModeHandler] = useState<any>(
    new DrawCircleFromCenterMode()
  );

  useEffect(() => {
    if (localFeatures.length === 0) {
      setModeHandler(new DrawCircleFromCenterMode());
    } else {
      setModeHandler(new EditingMode());
    }
  }, [localFeatures.length]);

  const onKeyDown = (event) => {
    if (["Delete", "Backspace"].includes(event.key)) {
      const editor = editorRef.current!;

      const selectedFeatureIndex = editor?.state.selectedFeatureIndex;
      if (selectedFeatureIndex == null) return;

      localFeatures.splice(selectedFeatureIndex, 1);
      setLocalFeatures(localFeatures);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%" }} onKeyDown={onKeyDown}>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        ref={mapRef}
        // @ts-ignore
        mapLib={maplibregl}
        mapStyle="https://api.maptiler.com/maps/positron/style.json?key=ytGeppRI3n5wUxjfP8oH"
        onViewportChange={(view) => setViewport(view)}
      >
        <Editor
          ref={editorRef}
          clickRadius={12}
          mode={modeHandler}
          features={localFeatures}
          onUpdate={({ editType, data }) => {
            if (["addFeature", "movePosition"].includes(editType)) {
              setLocalFeatures(data);
            }
          }}
          editHandleShape={() => null}
        />
      </MapGL>
    </div>
  );
};
