import { scaleSqrt } from 'd3-scale';
import _exports from '../../styles/_exports.module.scss';

const modernaPMID = '33378609';
const pfizerPMID = '33301246';
const spikePMID = '32075877';

const colorScale = scaleSqrt().domain([0, 14000]).range(['#ffbb96', '#6d0000']);

export const getNodeColorByState = (visState, hoveredNode) => {
  let fn;
  switch (visState) {
    case 'state1':
      fn = (node) => {
        return _exports.accent1;
      };
      break;

    case 'state2':
      fn = (node) => {
        if (node === hoveredNode) {
          return 'gray';
        } else if ([modernaPMID, pfizerPMID].includes(node.id)) {
          return _exports.accent1;
        } else {
          return 'white';
        }
      };
      break;

    case 'state3':
      fn = (node) => {
        if (node === hoveredNode) {
          return 'gray';
        } else if ([modernaPMID, pfizerPMID].includes(node.id)) {
          return _exports.accent1;
        } else if (node.nodeGroup === '2') {
          return 'white';
        } else {
          return 'rgba(255, 255, 255, .25)';
        }
      };
      break;

    case 'state4':
      fn = (node) =>
        node === hoveredNode ? 'white' : colorScale(node.nCitedBy);
      break;
    default:
      fn = (node) => {
        return `rgba(255, 0, 0, 1)`;
      };
  }
  return fn;
};
