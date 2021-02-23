import React from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer } from '@deck.gl/layers';
import { StaticMap } from 'react-map-gl';

// --- Map settings
const INITIAL_VIEW_STATE = {
  longitude: 14,
  latitude: 0,
  zoom: 1,
  pitch: 20
};

const data = [
  {
    src: {
      lng: -99.94, // US
      lat: 40.43
    },
    dst: {
      lng: 133.75, // Australia
      lat: -25.27
    }
  }
];

const CollabMap = (props) => {
  const layers = [
    new ArcLayer({
      data,
      id: 'arc-layer',
      getWidth: 4,
      getSourcePosition: (d) => [d.src.lng, d.src.lat],
      getTargetPosition: (d) => [d.dst.lng, d.dst.lat],
      getSourceColor: [255, 0, 0, 50],
      getTargetColor: [255, 0, 0, 50]
    })
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <StaticMap reuseMaps mapboxApiAccessToken={process.env.MAPBOX_TOKEN} />
    </DeckGL>
  );
};

export default CollabMap;
