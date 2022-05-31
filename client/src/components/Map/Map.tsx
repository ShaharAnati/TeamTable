import * as React from "react";
import { Map as ReactMap, MapRef, Marker, useControl } from "react-map-gl";
import maplibregl from "maplibre-gl";
import Geocoder from 'react-map-gl-geocoder'

import "maplibre-gl/dist/maplibre-gl.css";
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import GeocoderControl from "./GeocoderControl";


export const ResMap = (props) => {
    const mapRef = React.useRef<MapRef>();

    const { address } = props;
    console.log(address)

    const [foundPlace, setFoundPlace] = React.useState(null);

    React.useEffect(() => {

        const getCoordinates = async () => {
            const features = [];
            try {
                let request =
                    'https://nominatim.openstreetmap.org/search?q=' +
                    address +
                    '&format=geojson&polygon_geojson=1&countrycodes=il';
                const response = await fetch(request);
                const geojson = await response.json();
                for (let feature of geojson.features) {
                    let center = [
                        feature.bbox[0] +
                        (feature.bbox[2] - feature.bbox[0]) / 2,
                        feature.bbox[1] +
                        (feature.bbox[3] - feature.bbox[1]) / 2
                    ];
                    let point = {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: center
                        },
                        place_name: feature.properties.display_name,
                        properties: feature.properties,
                        text: feature.properties.display_name,
                        place_type: ['place'],
                        center: center
                    };
                    features.push(point);
                }
                if (features?.length > 0) {
                    setFoundPlace(features[0])
                    props.setMarker({ lng: features[0].center[0], lat: features[0].center[1] })
                    mapRef?.current?.flyTo({
                        center: features[0].center
                    })
                }
            } catch (err) {

            }
        }
        if (address)
            getCoordinates();
    }, [address, mapRef])


    // const [marker, setMarker] = React.useState(null);
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
            >
                {/* {props.marker && (
                    <Marker
                        style={{ color: 'white', padding: '0 4px' }}
                        longitude={props.marker?.lng}
                        latitude={props.marker?.lat}
                        anchor="bottom"

                    />)
                }
                <GeocoderControl position="top-left" SetCurrentMarker={props.setMarker} setAddress={props.setAddress} /> */}

                {foundPlace && (
                    <Marker
                        style={{ color: 'white', padding: '0 4px' }}
                        longitude={foundPlace.center[0]}
                        latitude={foundPlace.center[1]}
                        anchor="bottom"
                        draggable={true}
                        onDragEnd={(data) => props.setMarker(data.lngLat)}
                    />
                )}






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
