import React, { Component } from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer } from '@deck.gl/layers';
import { MapView } from '@deck.gl/core';
import { DataFilterExtension } from '@deck.gl/extensions';
import { StaticMap, ReactMapGL } from 'react-map-gl';
import { isEqual } from 'lodash';
import { timeParse } from 'd3-time-format';
import * as Papa from 'papaparse';
import dayjs from 'dayjs';
import { Utils } from '../../js/Utils.js';

import geoIDsCSV from './assets/geoIDs.csv';

// --- Map settings
const INITIAL_VIEW_STATE = {
  longitude: 15.98,
  latitude: 44.9,
  zoom: 0,
  pitch: 30,
  bearing: 0
};
const MAP_CONTROLS = {
  scrollZoom: false,
  dragPan: true,
  dragRotate: true,
  doubleClickZoom: false
};
const MB_STYLE = 'mapbox://styles/jeffmacinnes/ckl8iul9a1e3q19o5iromwhzi';

// --- Data
const geoIDs = geoIDsCSV.slice(1).map((d) => {
  return {
    idx: +d[0],
    lat: +d[1],
    lng: +d[2]
  };
});

const parseDateStr = timeParse('%Y-%m-%d'); // fn for parsing datestring in collaborations data

export default class CollabMap extends Component {
  constructor(props) {
    super(props);
    let currentDate = dayjs(new Date('01-01-2020'));
    this.nDays = 5; // +/- days around current date to show
    this.state = {
      mapControls: MAP_CONTROLS,
      viewState: {
        longitude: -122,
        latitude: 37.8,
        zoom: 0
      },
      collabs: [{ pubDate: new Date('2020-01-05'), srcIdx: 10, dstIdx: 12 }],
      currentDate: currentDate,
      dateWindow: {
        start: currentDate.subtract(this.nDays, 'days'),
        end: currentDate.add(this.nDays, 'days')
      },
      softDateWindow: {
        start: currentDate.subtract(1, 'days'),
        end: currentDate.add(1, 'days')
      }
    };
  }

  renderLayers = () => {
    let { collabs, dateWindow, currentDate } = this.state;

    // build arc layer from collabs
    const arcLayer = new ArcLayer({
      id: 'arc-layer',
      data: collabs,
      widthMinPixls: 1,
      getWidth: 1,
      dataComparator: (newData, oldData) => isEqual(newData, oldData),
      getSourcePosition: (d) => [
        geoIDs[d['srcIdx']].lng,
        geoIDs[d['srcIdx']].lat
      ],
      getTargetPosition: (d) => [
        geoIDs[d['dstIdx']].lng,
        geoIDs[d['dstIdx']].lat
      ],
      getSourceColor: (d) => [140, 140, 0, 50],
      getTargetColor: (d) => [211, 11, 124, 50],
      getTilt: (d) => Utils.randBw(-60, 60),
      getFilterValue: (d) => d.pubDate.valueOf() / 1000,
      filterRange: [dateWindow.start.unix(), dateWindow.end.unix()],
      filterSoftRange: [currentDate.unix(), currentDate.unix()],
      extensions: [new DataFilterExtension({ filterSize: 1 })]
    });

    return [arcLayer];
  };

  componentDidUpdate(prevProps) {
    let { currentDate } = this.props;
    if (prevProps.currentDate != currentDate) {
      let newDate = dayjs(currentDate);
      let dateWindow = {
        start: newDate.subtract(this.nDays, 'days'),
        end: newDate.add(this.nDays, 'days')
      };
      let softDateWindow = {
        start: newDate.subtract(1, 'days'),
        end: newDate.add(1, 'days')
      };

      this.setState({
        currentDate: newDate,
        dateWindow: dateWindow,
        softDateWindow: softDateWindow
      });
    }
  }

  componentDidMount() {
    // load all data
    Papa.parse(
      'https://raw.githubusercontent.com/jeffmacinnes/COVID_vis/master/websiteData/collabsByDate.csv',
      {
        download: true,
        header: true,
        worker: true,
        fastMode: true,
        complete: (results) => {
          const collabs = results.data.map((d, i) => {
            return {
              pubDate: parseDateStr(`2020-${d['pubDate']}`),
              srcIdx: +d['srcIdx'],
              dstIdx: +d['dstIdx']
            };
          });
          console.log('data loaded');
          this.setState({
            collabs
          });
          //this.renderLayers();
        }
      }
    );
  }

  render() {
    const { viewState } = this.state;

    return (
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={MAP_CONTROLS}
        layers={this.renderLayers()}
        //useDevicePixels={false}
        style={{ zIndex: -10 }}
        onDrag={() => console.log('dragged')}
      >
        <StaticMap
          mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
          mapStyle={MB_STYLE}
          //reuseMaps={true}
        />
      </DeckGL>
    );
  }
}
