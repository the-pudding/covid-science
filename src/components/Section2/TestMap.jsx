import React from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ColumnLayer } from '@deck.gl/layers';
import { DataFilterExtension } from '@deck.gl/extensions';
import { StaticMap } from 'react-map-gl';

// --- Map settings
const INITIAL_VIEW_STATE = {
  longitude: 15.98,
  latitude: 44.9,
  zoom: 0,
  pitch: 20,
  bearing: 0
};
// const MB_STYLE = 'mapbox://styles/jeffmacinnes/ckl8iul9a1e3q19o5iromwhzi';

const TestMap = (props) => {
  const data = [
    {
      value: 500,
      src: {
        lng: -99.94,
        lat: 40.43
      },
      dst: {
        lng: 102.9,
        lat: 47.53
      }
    }
  ];

  const layers = [
    new ArcLayer({
      data,
      id: 'arc-layer',
      getWidth: 4,
      getSourcePosition: (d) => [d.src.lng, d.src.lat],
      getTargetPosition: (d) => [d.dst.lng, d.dst.lat],
      getSourceColor: [255, 0, 0, 50],
      getTargetColor: [255, 0, 0, 50]
    }),

    new ColumnLayer({
      data,
      id: 'column-layer',
      radius: 25000,
      elevationScale: 10000,
      extruded: true,
      getPosition: (d) => [d.src.lng, d.src.lat],
      getFillColor: [0, 255, 0, 255],
      getElevation: (d) => d.value
    })
  ];

  console.log('called');

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      // style={{ zIndex: -10 }}
    >
      <StaticMap
        reuseMaps
        // mapStyle={MB_STYLE}
        // preventStyleDiffing={true}
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
      />
    </DeckGL>
  );
};

export default TestMap;
