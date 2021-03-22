import React, { useEffect, useState, useRef, useCallback } from 'react';
import ArticleAnnotation from './ArticleAnnotation';
import ForceGraph2D from 'react-force-graph-2d';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { getVisStateProps } from './visStates.js';
import { getNodeColorByState } from './colors.js';
import {
  getNodeVisibilityByState,
  getLinkVisibilityByState,
  getNodeSizeByState,
  getNodeObjByState,
  getNodeTooltipByState,
  fixNodesByState
} from './graphUtils.js';

import citeLinksCSV from './assets/vaxLinks.csv';
import citeNodesCSV from './assets/vaxNodes.csv';

import './CiteGraph.scss';

const xScale = scaleLinear().domain([0, 2]).range([1000, 0]);
const rScale = scaleSqrt().domain([0, 14000]).range([1, 40]);

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

// ADD TEST NODES
// [1, 2, 3, 4].forEach((d, i) => {
//   graphData.nodes.push({
//     id: 1000 + d,
//     title: 'aaa',
//     journal: 'bbb',
//     pubYear: 2020,
//     nodeGroup: '9',
//     nCitedBy: 100,
//     r: 10
//   });
// });

// console.log('data', graphData);

const modernaPMID = '33378609';
const pfizerPMID = '33301246';
const modernaAnnot = {
  vaccine: 'Moderna',
  title: 'Efficacy and Safety of the mRNA-1273 SARS-CoV-2 Vaccine',
  journal: 'New England Journal of Medicine',
  date: 'Dec 30 2020'
};
const pfizerAnnot = {
  vaccine: 'Pfizer',
  title: 'Safety and Efficacy of the BNT162b2 mRNA Covid-19 Vaccine',
  journal: 'New England Journal of Medicine',
  date: 'Dec 10 2020'
};

const CiteGraph = (props) => {
  const fgRef = useRef();
  const visStateRef = useRef();
  const [engineIsRunning, setEngineIsRunning] = useState(false);
  const [modernaCoords, setModernaCoords] = useState({ x: 0, y: 0 });
  const [pfizerCoords, setPfizerCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    // --- update camera based on new visState
    const fg = fgRef.current;
    const visStateProps = getVisStateProps(props.visState, xScale);
    const { centerAt, zoom, forcesArr } = visStateProps;

    // reset existing forces
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

  // -- Interaction handlers
  const handleNodeClick = (node) => {
    // console.log(node);
    window.open(`https://pubmed.ncbi.nlm.nih.gov/${node.id}`, '_blank');
  };
  const handleNodeHover = (node) => {
    if (node != null) {
      setIsHovered(true);
      setHoveredNode(node);
    } else {
      setIsHovered(false);
      setHoveredNode(null);
    }
  };
  const handleLinkClick = (link) => {
    console.log(link);
  };
  const handleEngineTick = (tick) => {
    if ((props.visState == 'state1') | (props.visState == 'state2')) {
      // set location of vax annotations
      const fg = fgRef.current;
      const vaxNodes = graphData.nodes.filter((n) => n.nodeGroup == '0');
      vaxNodes.forEach((n) => {
        let coords = fg.graph2ScreenCoords(n.x, n.y);
        if (n.id === modernaPMID) {
          coords.x += 25;
          coords.y -= 110;
          setModernaCoords(coords);
        } else if (n.id === pfizerPMID) {
          coords.x += 25;
          coords.y += 40;
          setPfizerCoords(coords);
        }
      });
    }
  };

  return (
    <div style={{ cursor: isHovered ? 'pointer' : 'auto' }}>
      <ArticleAnnotation
        coords={modernaCoords}
        visible={props.visState == 'state1'}
        content={modernaAnnot}
      />
      <ArticleAnnotation
        coords={pfizerCoords}
        visible={props.visState == 'state1'}
        content={pfizerAnnot}
      />
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        linkColor={() => 'rgba(255, 255, 255, .1)'}
        linkVisibility={getLinkVisibilityByState(props.visState)}
        linkCurvature={(link) => (link.source.y > link.target.y ? -0.2 : 0.2)}
        nodeColor={getNodeColorByState(props.visState, hoveredNode)}
        nodeVisibility={getNodeVisibilityByState(props.visState)}
        nodeVal={getNodeSizeByState(props.visState)}
        nodeCanvasObject={getNodeObjByState(props.visState, hoveredNode)}
        nodeCanvasObjectMode={() => 'after'}
        nodeRelSize={1}
        onNodeHover={handleNodeHover}
        nodeLabel={getNodeTooltipByState(props.visState)}
        enableZoomPanInteraction={false}
        enablePointerInteraction={true}
        onNodeClick={handleNodeClick}
        onLinkClick={handleLinkClick}
        onEngineTick={handleEngineTick}
        d3AlphaDecay={0.06}
        d3VelocityDecay={0.15} // .3
      />
    </div>
  );
};

export default CiteGraph;
