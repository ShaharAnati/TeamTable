import * as React from "react";
import { Map as ReactMap, MapRef, Marker, useControl } from "react-map-gl-v7";
import maplibregl from "maplibre-gl";
import './Map.css';
import "maplibre-gl/dist/maplibre-gl.css";
import GeocoderControl from "./GeocoderControl";

export const ResMap = (props) => {
  const mapRef = React.useRef<MapRef>();

  const { address, setAddress, location, setLocation } = props;

  const geocoderContainerRef = React.useRef();
  return (
    <div ref={geocoderContainerRef}>
      <ReactMap
        style={{ height: "400px", width: "100%" }}
        ref={mapRef}
        mapLib={maplibregl}
        mapStyle="https://api.maptiler.com/maps/positron/style.json?key=ytGeppRI3n5wUxjfP8oH"
        initialViewState={{
          longitude: location?.lng || 34.77876808975043,
          latitude: location?.lat || 32.071869249621386,
          zoom: 14,
        }}
      >

        <GeocoderControl
          position="top-left"
          setCurrentMarker={setLocation}
          setAddress={setAddress}
          address={address}
        />

        {location && (
          <Marker
            style={{ color: "white", padding: "0 4px" }}
            longitude={location.lng}
            latitude={location.lat}
            anchor="bottom"
            draggable={true}
            onDragEnd={(data) => setLocation(data.lngLat)}
          />
        )}
      </ReactMap>
    </div>
  );
};