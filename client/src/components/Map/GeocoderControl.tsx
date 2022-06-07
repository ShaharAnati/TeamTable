import * as React from 'react';
import { useState } from 'react';
import { useControl } from 'react-map-gl';

import { Address } from '../../types/Resturants';

import maplibregl from "maplibre-gl";
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder'
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css'


// type GeocoderControlProps = Omit<GeocoderOptions, 'accessToken' | 'mapboxgl' | 'marker'> & {
//     mapboxAccessToken: string;
//     marker?: boolean | Omit<MarkerProps, 'longitude' | 'latitude'>;

//     position: ControlPosition;

//     onLoading?: (e: object) => void;
//     onResults?: (e: object) => void;
//     onResult?: (e: object) => void;
//     onError?: (e: object) => void;
// };

/* eslint-disable complexity,max-statements */
export const reverseGeocode = async (location: { lat: number, lng: number }): Promise<Address> => {
    try {
        const request = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.lat}&lon=${location.lng}`
        const response = await fetch(request);
        const resjson = await response.json();

        return resjson.address;
    } catch (error) {
        console.error(`Failed to reverseGeocode with error: ${error}`);
    }
}



export default function GeocoderControl(props) {



    const [marker, setMarker] = useState(null);

    useControl<MaplibreGeocoder>(
        () => {
            const geocorder_api = {
                forwardGeocode: async (config) => {
                    const features = [];
                    try {
                        let request =
                            'https://nominatim.openstreetmap.org/search?q=' +
                            config.query +
                            '&format=geojson&polygon_geojson=1&addressdetails=0&countrycodes=il';
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
                    } catch (e) {
                        console.error(`Failed to forwardGeocode with error: ${e}`);
                    }

                    return {
                        features: features,

                    };
                }
            }

            const ctrl = new MaplibreGeocoder(geocorder_api, { maplibregl, marker: false, debounceSearch: 700, showResultsWhileTyping: true });
            ctrl.on('loading', props.onLoading);
            ctrl.on('results', props.onResults);
            ctrl.on('result', evt => {
                props.onResult(evt);

                const { result } = evt;
                const location =
                    result &&
                    (result.center || (result.geometry?.type === 'Point' && result.geometry.coordinates));
                if (location) {
                    console.log(result)
                    // debugger;
                    props.setAddress(result.properties.address);
                    props.setCurrentMarker({ lng: location[0], lat: location[1] });
                } else {
                    setMarker(null);
                }
            });
            ctrl.on('error', props.onError);
            return ctrl;
        },
        {
            position: props.position,

        }
    );

    return null;
}

const noop = () => { };

GeocoderControl.defaultProps = {
    marker: true,
    onLoading: noop,
    onResults: noop,
    onResult: noop,
    onError: noop
};