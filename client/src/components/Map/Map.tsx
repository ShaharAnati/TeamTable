import * as React from "react";
import { Map as ReactMap, Marker } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export const Map = (props) => {
    const [markers, setMarkers] = React.useState([]);

    return (
        <div style={{ height: 600, width: 1000 }}>
            <ReactMap
                mapLib={maplibregl}
                mapStyle="https://api.maptiler.com/maps/streets/style.json?key=ytGeppRI3n5wUxjfP8oH"
                initialViewState={{
                    longitude: 34.77876808975043,
                    latitude: 32.071869249621386,
                    zoom: 14,
                }}
                onClick={(data) => {
                    console.log(data);
                    setMarkers((oldMarkers) => [...oldMarkers, { ...data.lngLat }]);
                }}
            >
                {markers.map((marker) => {
                    return (
                        <Marker
                            style={{ background: 'pink', color: 'white', padding: '0 4px' }}
                            longitude={marker.lng}
                            latitude={marker.lat}
                            anchor="bottom"
                        >
                            Illi The Queen
                        </Marker>
                    );
                })}
            </ReactMap>
        </div>
    );
};
