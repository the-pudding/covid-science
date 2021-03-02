import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { scaleLinear } from 'd3-scale';
import { cloneDeep, difference } from 'lodash';
import { getVisStateProps } from './visStates.js';
import { getNodeColorByState } from './colors.js';
import {
  getNodeVisibilityByState,
  getLinkVisibilityByState,
  fixNodesByState
} from './graphUtils.js';

import citeLinksCSV from './assets/citeLinks.csv';
import citeNodesCSV from './assets/citeNodes.csv';

const xScale = scaleLinear().domain([0, 2]).range([500, 0]);

// --- Prep the data for the graph
const dataMaster = {
  nodes: citeNodesCSV.slice(1).map((d) => {
    return {
      id: d[0],
      title: d[1],
      journal: d[2],
      nodeGroup: d[3],
      isSpikeNode: d[4] == '1'
    };
  }),
  links: citeLinksCSV.slice(1).map((d, i) => {
    return {
      source: d[0],
      target: d[1],
      deg: d[2],
      isSpikeLink: d[3] == '1',
      idx: i
    };
  })
};

console.log('data', dataMaster);

const getDataByState = (currentData, visState) => {
  // -- Update graphData based on current visState
  // figure out the set of links and nodes that should be present on this visState
  let dataCopy = cloneDeep(dataMaster, true);
  switch (visState) {
    case 'state1':
      return {
        nodes: dataCopy.nodes.filter((n) => n.nodeGroup == 0),
        links: []
      };
    case 'state2':
      return {
        nodes: dataCopy.nodes.filter((n) => ['0', '1'].includes(n.nodeGroup)),
        links: dataCopy.links.filter((l) => l.deg == '1')
      };
    case 'state3':
      return {
        nodes: dataCopy.nodes.filter((n) =>
          ['0', '1', '2'].includes(n.nodeGroup)
        ),
        links: dataCopy.links.filter((l) => ['1', '2'].includes(l.deg))
      };
    default:
      return {
        links: [],
        nodes: []
      };
  }
};

const CiteGraph = (props) => {
  const fgRef = useRef();
  const visStateRef = useRef();
  const [graphData, setGraphData] = useState(dataMaster);
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
    if (!engineIsRunning) {
      fixNodesByState(graphData, props.visState, visStateRef.current);
    }
    fg.d3ReheatSimulation();

    // move camera for this visState
    fg.centerAt(centerAt[0], centerAt[1], 2000);
    fg.zoom(zoom, 2000);

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
        enableZoomPanInteraction={false}
        onNodeClick={handleClick}
        onLinkClick={handleLinkClick}
        onBackgroundClick={handleBgClick}
        onEngineTick={() => !engineIsRunning && setEngineIsRunning(true)}
        onEngineStop={() => setEngineIsRunning(false)}
        d3AlphaDecay={0.3}
      />
    </div>
  );
};

export default CiteGraph;
