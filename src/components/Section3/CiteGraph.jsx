import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { timeParse } from 'd3-time-format';
import { scaleTime, scaleLinear } from 'd3-scale';
import { cloneDeep, difference } from 'lodash';
import { getVisStateProps } from './visStates';
import { getNodeColorByState } from './colors';

import citeLinksCSV from './assets/vaxCiteLinks.csv';
import citeNodesCSV from './assets/vaxCiteNodes.csv';

const xScale = scaleLinear().domain([0, 2]).range([500, 0]);

// --- Prep the data for the graph
const dataMaster = {
  nodes: citeNodesCSV.slice(1).map((d) => {
    return {
      id: d[0],
      title: d[1],
      journal: d[2],
      nodeGroup: d[3]
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
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // --- update data based on state changes
    console.log(props.visState);
    const gd = getDataByState(graphData, props.visState);
    console.log('new gd', gd);
    setGraphData(gd);

    // --- update forces
    const fg = fgRef.current;

    // get the props for this visState
    const visStateProps = getVisStateProps(props.visState, xScale);
    const { forcesArr, centerAt, zoom } = visStateProps;

    // update forces
    fg.d3Force('center', null); // deactivate existing forces
    fg.d3Force('charge', null);
    fg.d3Force('link', null);

    // update forces
    for (let forceObj of forcesArr) {
      fg.d3Force(forceObj.name, forceObj.force);
    }
    //fg.d3ReheatSimulation();

    fg.centerAt(centerAt[0], centerAt[1], 2000);
    fg.zoom(zoom, 2000);
  }, [props.visState]);

  const nodeColorFn = getNodeColorByState(props.visState, graphData);

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
        linkColor={() => 'rgba(255, 255, 255, .12)'}
        linkOpacity={0.12}
        linkCurvature={(link) => (link.source.y > link.target.y ? -0.2 : 0.2)}
        linkDirectionalParticles={0}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.001}
        nodeColor={nodeColorFn}
        cooldownTime={Infinity}
        //cooldownTicks={100}
        //onEngineStop={() => fgRef.current.zoomToFit(400)}
        enableZoomPanInteraction={false}
        onNodeClick={handleClick}
        onLinkClick={handleLinkClick}
        onBackgroundClick={handleBgClick}
      />
    </div>
  );
};

export default CiteGraph;
