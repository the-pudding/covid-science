import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { scaleLinear } from 'd3-scale';
import { cloneDeep, difference } from 'lodash';
import { getVisStateProps } from './visStates.js';
import { getNodeColorByState } from './colors.js';
import {
  getNodeVisibilityByState,
  getLinkVisibilityByState,
  getNodeSizeByState,
  fixNodesByState
} from './graphUtils.js';
import {
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceCollide
} from 'd3-force';

import citeLinksCSV from './assets/vaxLinks.csv';
import citeNodesCSV from './assets/vaxNodes.csv';

const xScale = scaleLinear().domain([0, 2]).range([500, 0]);
const rScale = scaleLinear().domain([0, 14000]).range([5, 500]);

// --- Prep the data for the graph
const graphData = {
  nodes: citeNodesCSV.slice(1).map((d) => {
    return {
      id: d[0],
      title: d[1],
      journal: d[2],
      pubYear: +d[3],
      nodeGroup: d[4],
      nCitedBy: +d[5],
      r: rScale(+d[5])
    };
  }),
  links: citeLinksCSV.slice(1).map((d, i) => {
    return {
      source: d[0],
      target: d[1],
      deg: d[2],
      idx: i
    };
  })
};

console.log('data', graphData);

const CiteGraph = (props) => {
  const fgRef = useRef();
  const visStateRef = useRef();
  const [engineIsRunning, setEngineIsRunning] = useState(false);

  useEffect(() => {
    // --- update camera based on new visState
    const fg = fgRef.current;
    const visStateProps = getVisStateProps(props.visState, xScale);
    const { centerAt, zoom, forcesArr } = visStateProps;

    // remove existing forces
    fg.d3Force('center', null);
    fg.d3Force('charge', null);
    fg.d3Force('link', null);

    // set new forces
    for (let forceObj of forcesArr) {
      fg.d3Force(forceObj.name, forceObj.force);
    }

    // set which nodes are fixed
    // if (!engineIsRunning) {
    //   fixNodesByState(graphData, props.visState, visStateRef.current);
    // }
    fg.d3ReheatSimulation();

    // move camera for this visState
    fg.centerAt(centerAt[0], centerAt[1], 2000);
    fg.zoom(zoom, 2000);
    //fg.zoomToFit(400);

    // update visStateRef
    visStateRef.current = props.visState;
  }, [props.visState]);

  const handleClick = (node) => {
    console.log(node);
  };
  const handleBgClick = () => {
    console.log(graphData);
  };
  const handleLinkClick = (link) => {
    console.log(link);
  };
  const handleEngineTick = (tick) => {
    !engineIsRunning && setEngineIsRunning(true);
    // console.log(tick);
  };

  return (
    <div>
      <div className="test">{props.visState}</div>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        linkColor={() => 'rgba(255, 255, 255, .1)'}
        linkVisibility={getLinkVisibilityByState(props.visState)}
        linkCurvature={(link) => (link.source.y > link.target.y ? -0.2 : 0.2)}
        nodeColor={getNodeColorByState(props.visState)}
        nodeVisibility={getNodeVisibilityByState(props.visState)}
        nodeVal={getNodeSizeByState(props.visState)}
        nodeRelSize={1}
        enableZoomPanInteraction={false}
        onNodeClick={handleClick}
        onLinkClick={handleLinkClick}
        onBackgroundClick={handleBgClick}
        onEngineTick={handleEngineTick}
        onEngineStop={() => setEngineIsRunning(false)}
        d3AlphaDecay={0.4}
      />
    </div>
  );
};

export default CiteGraph;
