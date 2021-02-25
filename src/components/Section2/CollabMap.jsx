import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import { DataFilterExtension } from '@deck.gl/extensions';
import { StaticMap } from 'react-map-gl';

import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
dayjs.extend(dayOfYear);
import { timeParse, timeFormat } from 'd3-time-format';
import { groups } from 'd3-array';
import { Utils } from '../../js/Utils.js';
import * as Papa from 'papaparse';

import geoIDsCSV from './assets/geoIDs.csv';

// --- Map settings
const VIEW_STATE = {
  longitude: 15.98,
  latitude: 0,
  zoom: 1,
  pitch: 20,
  bearing: 0
};
const MAP_CONTROLS = {
  scrollZoom: false,
  dragPan: true,
  dragRotate: true,
  doubleClickZoom: false
};
const MB_STYLE = 'mapbox://styles/jeffmacinnes/ckl8iul9a1e3q19o5iromwhzi';

// --- GEO IDs Data
const geoIDs = geoIDsCSV.slice(1).map((d) => {
  return {
    idx: +d[0],
    lat: +d[1],
    lng: +d[2]
  };
});

const parseDateStr = timeParse('%Y-%m-%d'); // fn for parsing datestring in collaborations data
const formatDateStr = timeFormat('%Y-%m-%d');

const CollabMap = (props) => {
  const [collabs, setCollabs] = useState([]);
  const [geoIDsByDate, setGeoIDsByDate] = useState(null);

  // define current date window
  const currentDate = dayjs(props.currentDate);
  const dateWindow = {
    start: currentDate.subtract(5, 'days'),
    end: currentDate.add(5, 'days')
  };

  const layers = [
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: geoIDs,
      // radiusScale: 10000,
      getPosition: (d) => [d.lng, d.lat],
      getRadius: 60000,
      getFillColor: [255, 255, 255, 150],
      getFilterValue: (d) => {
        if (geoIDsByDate) {
          return geoIDsByDate[d.idx][currentDate.dayOfYear() - 1] === 1
            ? 1
            : -999;
        } else {
          return -999;
        }
      },
      filterRange: [0, 2],
      extensions: [new DataFilterExtension({ filterSize: 1 })],
      updateTriggers: {
        getFilterValue: currentDate
      }
    }),

    new ArcLayer({
      id: 'arc-layer',
      data: collabs,
      getSourcePosition: (d) => [
        geoIDs[d['srcIdx']].lng,
        geoIDs[d['srcIdx']].lat
      ],
      getTargetPosition: (d) => [
        geoIDs[d['dstIdx']].lng,
        geoIDs[d['dstIdx']].lat
      ],
      getSourceColor: [140, 140, 0, 50],
      getTargetColor: [211, 11, 124, 50],
      getTilt: (d) => Math.random() * 120 - 60,
      getFilterValue: (d) => d.pubDate.valueOf() / 1000,
      filterRange: [dateWindow.start.unix(), dateWindow.end.unix()],
      filterSoftRange: [currentDate.unix(), currentDate.unix()],
      extensions: [new DataFilterExtension({ filterSize: 1 })]
    })
  ];

  useEffect(() => {
    // load collab data
    Papa.parse(
      'https://raw.githubusercontent.com/jeffmacinnes/COVID_vis/master/websiteData/collabsByDate.csv',
      {
        download: true,
        header: true,
        worker: true,
        fastMode: true,
        complete: (results) => {
          // parse collaboration data
          const collabs = results.data.map((d, i) => {
            return {
              pubDate: parseDateStr(`2020-${d['pubDate']}`),
              srcIdx: +d['srcIdx'],
              dstIdx: +d['dstIdx']
            };
          });
          setCollabs(collabs);

          // determine which geoIDs present on each date.
          // precompute matrix of geoIDs by Dates for fast lookup later
          let geoIDsByDate = [];
          for (let i = 0; i < geoIDs.length; i++) {
            geoIDsByDate.push(new Array(366).fill(0)); // 366 days for 2020 leap year
          }
          groups(collabs, (d) => d.pubDate).forEach((d) => {
            // group by date, then iterate over each nested date array to get the geoIDs for that date
            const dayIdx = dayjs(formatDateStr(d[0])).dayOfYear() - 1; // dayOfYear starts at 1
            const daysCollabs = d[1];
            const theseGeoIDs = new Set(
              daysCollabs.flatMap((dd) => [dd.srcIdx, dd.dstIdx])
            );
            for (let geoIdx of theseGeoIDs) {
              geoIDsByDate[geoIdx][dayIdx] = 1;
            }
          });
          // geoIDsByDate is 2D array [geoIdx][dayIdx]
          setGeoIDsByDate(geoIDsByDate);
        }
      }
    );
  }, []);

  return (
    <DeckGL
      initialViewState={{
        ...VIEW_STATE,
        //bearing: Utils.map(currentDate.dayOfYear(), 0, 366, 360, 345),
        pitch: Utils.map(currentDate.dayOfYear(), 0, 366, 45, 10)
      }}
      controller={MAP_CONTROLS}
      layers={layers}
      style={{ zIndex: -10 }}
    >
      <StaticMap
        reuseMaps
        mapStyle={MB_STYLE}
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
      />
    </DeckGL>
  );
};

export default CollabMap;
