import * as React from "react";
import ReactMap, { Marker } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { Editor, DrawPolygonMode, DrawCircleFromCenterMode } from 'react-map-gl-draw';


import "maplibre-gl/dist/maplibre-gl.css";
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'

const DEFAULT_VIEWPORT = {
    width: 800,
    height: 600,
    longitude: -122.45,
    latitude: 37.78,
    zoom: 14,
  };


const ChooseRadiusMap = () => {
    const [mode, setMode] = React.useState(new DrawPolygonMode());
    
    return (
      <ReactMap
        mapLib={maplibregl}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=ytGeppRI3n5wUxjfP8oH"        
        initialViewState={{
            longitude: 34.77876808975043,
            latitude: 32.071869249621386,
            zoom: 14,
        }}
        style={{height: '600px', width: '400px'}}
      >
        <Editor
          // to make the lines/vertices easier to interact with
          clickRadius={12}
          mode={mode}
          onUpdate={({ data, editType }) => {
            console.log(editType);
            // setFeatures({ features: data });
          }}
          onSelect={(selected) => {
            console.log(selected);
          }}
        />
      </ReactMap>
    );
}

export default ChooseRadiusMap;


















// import {
//     CircleMode,
//     DragCircleMode,
//     DirectMode,
//     SimpleSelectMode
// } from 'mapbox-gl-draw-circle';
// import mapboxgl from 'mapbox-gl';
// import maplibregl from "maplibre-gl";

// import MapboxDraw from "@mapbox/mapbox-gl-draw";

// import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
// import "maplibre-gl/dist/maplibre-gl.css";

// const map = new maplibregl.Map({
//     container: 'map', // container id
//     style:
//     'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL', //hosted style id
//     center: [-91.874, 42.76], // starting position
//     zoom: 12 // starting zoom
// });
     

// const draw = new MapboxDraw({
//     defaultMode: "draw_circle",
//     userProperties: true,
//     modes: {
//       ...MapboxDraw.modes,
//       draw_circle  : CircleMode,
//       drag_circle  : DragCircleMode,
//       direct_select: DirectMode,
//       simple_select: SimpleSelectMode
//     }
//   });

// //@ts-ignore
// map.addControl(draw);


// // //   draw.changeMode('draw_circle', { initialRadiusInKm: 0.5 });

// //   map.addControl(draw);

// export default map;
