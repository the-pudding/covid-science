const modernaPMCID = 'PMC7787219';
const pfizerPMCID = 'PMC7745181';
const spikePMCID = 'PMC7164637';

const modernaPMID = '33378609';
const pfizerPMID = '33301246';
const spikePMID = '32075877';

export const getNodeColorByState = (visState, graphData) => {
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
        } else if ((node.id = '11')) {
          return 'white';
        } else {
          return 'rgba(255, 255, 255, .25)';
        }
      };
      break;

    case 'state4':
    case 'state5':
      // figure out nodeIDs of links attached to spike Node or vax nodes
      const { links } = graphData;
      let linkedNodes = [
        ...new Set(
          links
            .filter((d) => {
              return (
                [spikePMID, modernaPMID, pfizerPMID].includes(d.source.id) ||
                [spikePMID, modernaPMID, pfizerPMID].includes(d.target.id)
              );
            })
            .flatMap((d) => [d.source.id, d.target.id])
        )
      ];

      fn = (node) => {
        if (node.id === spikePMID) {
          return 'tomato';
        } else {
          return linkedNodes.includes(node.id)
            ? 'rgba(255, 255, 255, 1)'
            : 'rgba(255, 255, 255, .25)';
        }
      };
      break;

    case 'state6':
      fn = (node) =>
        node.id === spikePMID ? 'tomato' : 'rgba(255, 255, 255, 1)';
      break;

    default:
      fn = (node) => {
        return `rgba(255, 0, 0, 1)`;
      };
  }
  return fn;
};
