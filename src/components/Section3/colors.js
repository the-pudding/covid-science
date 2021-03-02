const modernaPMID = '33378609';
const pfizerPMID = '33301246';
const spikePMID = '32075877';

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
        if ([modernaPMID, pfizerPMID].includes(node.id)) {
          return 'tomato';
        } else {
          return 'white';
        }
      };
      break;

    case 'state3':
      fn = (node) => {
        if ([modernaPMID, pfizerPMID].includes(node.id)) {
          return 'tomato';
        } else if (node.nodeGroup === '2') {
          return 'white';
        } else {
          return 'rgba(255, 255, 255, .25)';
        }
      };
      break;

    case 'state4':
      fn = (node) => {
        if (node.id === spikePMID) {
          return 'tomato';
        } else if (node.isSpikeNode == true) {
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
