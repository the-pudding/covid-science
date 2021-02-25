import { RGBA_ASTC_10x10_Format } from 'three';

const modernaPMCID = 'PMC7787219';
const pfizerPMCID = 'PMC7745181';

export const getNodeColorByState = (visState) => {
  let fn;

  switch (visState) {
    case 'state1':
      fn = (node) => {
        return `tomato`;
      };
      break;

    case 'state2':
      fn = (node) => {
        if ([modernaPMCID, pfizerPMCID].includes(node.id)) {
          return 'tomato';
        } else {
          return 'white';
        }
      };
      break;

    case 'state3':
      fn = (node) => {
        if ([modernaPMCID, pfizerPMCID].includes(node.id)) {
          return 'tomato';
        } else if (node.isNew) {
          return 'white';
        } else {
          return 'rgba(255, 255, 255, .25)';
        }
      };
      break;

    default:
      fn = (node) => {
        return `rgba(255, 0, 0, 1)`;
      };
  }
  return fn;
};
