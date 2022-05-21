import * as React from "react";
import { Map as ReactMap, Marker, useControl } from "react-map-gl";
import maplibregl from "maplibre-gl";
import Geocoder from 'react-map-gl-geocoder'

import "maplibre-gl/dist/maplibre-gl.css";
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import GeocoderControl from "./GeocoderControl";


export const Map = (props) => {
    // const [marker, setMarker] = React.useState(null);
    const mapRef = React.useRef();
    const geocoderContainerRef = React.useRef();
    return (
        <div ref={geocoderContainerRef} style={{ height: 500, width: 1000, margin: '10px 0' }} >
            <ReactMap
                ref={mapRef}
                mapLib={maplibregl}
                mapStyle="https://api.maptiler.com/maps/streets/style.json?key=ytGeppRI3n5wUxjfP8oH"
                initialViewState={{
                    longitude: 34.77876808975043,
                    latitude: 32.071869249621386,
                    zoom: 14,
                }}
                onClick={(data) => {
                    props.setMarker(data.lngLat);
                }}
            >
                {props.marker && (
                    <Marker
                        style={{ color: 'white', padding: '0 4px' }}
                        longitude={props.marker?.lng}
                        latitude={props.marker?.lat}
                        anchor="bottom"

                    />)
                }
                <GeocoderControl position="top-left" SetCurrentMarker={props.setMarker} setAddress={props.setAddress} />
                {/* <Geocoder
                    mapRef={mapRef}
                    containerRef={geocoderContainerRef}
                    // onViewportChange={(data) => {
                    //     console.log(data);
                    //     setMarker(data.lngLat);
                    // }}
                    mapboxApiAccessToken={"ytGeppRI3n5wUxjfP8oH"}
                    position="top-left"
                /> */}
            </ReactMap>
        </div>
    );
};
