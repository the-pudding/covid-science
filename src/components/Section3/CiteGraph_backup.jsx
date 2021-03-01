import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { timeParse } from 'd3-time-format';
import { scaleTime, scaleLinear } from 'd3-scale';
import { cloneDeep, difference } from 'lodash';
import { getVisStateProps } from './visStates';
import { getNodeColorByState } from './colors';

import citeLinksCSV from './assets/simpleLinks.csv';
import citeNodesCSV from './assets/simpleNodes.csv';

const xScale = scaleLinear().domain([0, 2]).range([500, 0]);

console.log(xScale(1));

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

const modernaPMCID = 'PMC7787219';
const pfizerPMCID = 'PMC7745181';
const modernaPMID = '33378609';
const pfizerPMID = '33301246';
const spikePMID = '32075877';

const getDataByState = (currentData, visState) => {
  // -- Update graphData based on current visState
  // figure out the set of links and nodes that should be present on this visState
  let newLinks;
  let newNodes;
  let linkNodes;
  let nodeGroups;
  let dataCopy = cloneDeep(dataMaster, true);
  switch (visState) {
    case 'state1':
      newLinks = [];
      newNodes = dataCopy.nodes.filter((d) => d.nodeGroup == 0);
      break;
    case 'state2':
      newLinks = dataCopy.links.filter((d) => d.deg == '1');
      linkNodes = [...new Set(newLinks.flatMap((d) => [d.source, d.target]))];
      newNodes = dataCopy.nodes.filter((d) => linkNodes.includes(d.id));
      console.log('links', newLinks);
      console.log('nodes', newNodes);
      break;
    case 'state3':
    case 'state4':
    case 'state5':
      newLinks = dataCopy.links.filter((d) => d.deg == '1' || d.deg == '2');
      linkNodes = [...new Set(newLinks.flatMap((d) => [d.source, d.target]))];
      newNodes = dataCopy.nodes.filter((d) => linkNodes.includes(d.id));
      console.log('links', newLinks);
      console.log('nodes', newNodes);
      break;
    default:
      newLinks = [];
      newNodes = [];
  }

  // compare existing new links/nodes against existing ones
  let reconciledData = reconcileData(currentData, newLinks, newNodes);
  console.log('reconciledData', reconciledData);

  return reconciledData;
};

const reconcileData = (currentData, newLinks, newNodes) => {
  // update the currentData by adding/removing any new links/nodes as necessary
  let dataCopy = cloneDeep(currentData, true);
  let { links, nodes } = dataCopy;

  // // reset isNew field on all links and nodes
  // links = links.map((d) => {
  //   return { ...d, isNew: false };
  // });
  // nodes = nodes.map((d) => {
  //   return { ...d, isNew: false };
  // });

  // -- links
  const currLinkIds = new Set(links.map((d) => d.idx));
  const newLinkIds = new Set(newLinks.map((d) => d.idx));
  // figure out which new ids aren't in current link set
  const linkIdsToAdd = [
    ...new Set([...newLinkIds].filter((d) => !currLinkIds.has(d)))
  ];
  const linksToAdd = newLinks.filter((d) => linkIdsToAdd.includes(d.idx));
  for (let link of linksToAdd) {
    // link.isNew = true;
    links.push(link);
  }
  // figure out which current ids aren't in the newLinks
  const linkIdsToRemove = [
    ...new Set([...currLinkIds].filter((d) => !newLinkIds.has(d)))
  ];
  const updatedLinks = links.filter((d) => !linkIdsToRemove.includes(d.idx));

  // -- nodes
  const currNodePMCIDs = new Set(nodes.map((d) => d.id));
  const newNodePMCIDs = new Set(newNodes.map((d) => d.id));
  // figure out which new nodes aren't in current nodes
  const nodesIdsToAdd = [
    ...new Set([...newNodePMCIDs].filter((d) => !currNodePMCIDs.has(d)))
  ];
  const nodesToAdd = newNodes.filter((d) => nodesIdsToAdd.includes(d.id));
  for (let node of nodesToAdd) {
    // node.isNew = true;
    nodes.push(node);
  }
  // figure out which current nodes aren't in the newNodes
  const nodeIdsToRemove = [
    ...new Set([...currNodePMCIDs].filter((d) => !newNodePMCIDs.has(d)))
  ];
  const updatedNodes = nodes.filter((d) => !nodeIdsToRemove.includes(d.id));

  return { nodes: updatedNodes, links: updatedLinks };
};

const CiteGraph = (props) => {
  const fgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // --- update data based on state changes
    console.log(props.visState);
    const gd = getDataByState(graphData, props.visState);
    setGraphData(gd);

    // --- update forces
    const fg = fgRef.current;

    // get the props for this visState
    const visStateProps = getVisStateProps(props.visState, xScale);
    const { forcesArr, centerAt, zoom } = visStateProps;

    // update forces
    // for (let forceName of ['center', 'charge', 'collide', 'x', 'y', 'center']){
    //   fg.d3Force(forceName, null)
    // }//
    fg.d3Force('center', null); // deactivate existing forces
    fg.d3Force('charge', null);
    fg.d3Force('link', null);
    fg.d3Force('y', null);

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
        linkDirectionalParticles={props.visState === 'state6' ? 0 : 2}
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
