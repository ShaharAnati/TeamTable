import React, { useEffect, useRef, useState } from "react";
import MapGL, { MapRef, Marker, setRTLTextPlugin } from "react-map-gl";
import maplibregl from "maplibre-gl";
import {
  Editor,
  DrawCircleFromCenterMode,
  EditingMode,
} from "react-map-gl-draw";
import "maplibre-gl/dist/maplibre-gl.css";
import { Restaurant } from "src/types/Resturants";
import Pin from "./Pin";
import { Tooltip } from "@mui/material";

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

type Props = {
  filters: any;
  onFiltersChange: Function;
  selectedRestaurant?: Restaurant;
  restaurants: Restaurant[];
};

export const ResMap = (props: Props) => {
  const { filters, onFiltersChange, selectedRestaurant, restaurants } = props;

  const mapRef = useRef<MapRef>();
  const editorRef = useRef<any>()!;

  const featureExist = !!filters?.selectedArea;

  const [localFeatures, setLocalFeatures] = useState(
    filters?.selectedArea ? [filters.selectedArea] : []
  );

  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [modeHandler, setModeHandler] = useState<any>(
    new DrawCircleFromCenterMode()
  );

  useEffect(() => {
    setLocalFeatures(filters?.selectedArea ? [filters.selectedArea] : []);
  }, [filters?.selectedArea]);

  useEffect(() => {
    if (!featureExist) {
      setModeHandler(new DrawCircleFromCenterMode());
    } else {
      setModeHandler(new EditingMode());
    }
  }, [featureExist]);

  const handleSelectionChnage = (localFeatures) => {
    onFiltersChange({ ...filters, selectedArea: localFeatures[0] });
  };

  const onKeyDown = (event) => {
    if (["Delete", "Backspace"].includes(event.key)) {
      const editor = editorRef.current!;

      const selectedFeatureIndex = editor?.state.selectedFeatureIndex;
      if (selectedFeatureIndex == null) return;

      handleSelectionChnage([null]);
    }
  };

  const onMouseUp = (event) => {
    if (localFeatures.length > 0) {
      if (localFeatures[0] !== filters?.selectedArea) {
        handleSelectionChnage(localFeatures);
      }
    }
  };

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      onKeyDown={onKeyDown}
      onMouseUp={onMouseUp}
    >
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

        {restaurants.map((restaurant) => (
          <Marker
            key={`marker-${restaurant?.id}`}
            longitude={restaurant.location.lng}
            latitude={restaurant.location.lat}
            offsetLeft={-10}
            offsetTop={-17}
            className={selectedRestaurant && restaurant.id === selectedRestaurant.id ? 'selected-restaurant-pin' : ''}
          >
            <Tooltip title={restaurant.name} placement="top">
              <div>
                <Pin selected={restaurant.id === selectedRestaurant?.id} />
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapGL>
    </div>
  );
};
