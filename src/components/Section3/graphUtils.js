export const getNodeVisibilityByState = (visState) => {
  let fn;
  switch (visState) {
    case 'state1':
      fn = (node) => node.nodeGroup === '0';
      break;
    case 'state2':
      fn = (node) => ['0', '1'].includes(node.nodeGroup);
      break;
    case 'state3':
    case 'state4':
      fn = (node) => ['0', '1', '2'].includes(node.nodeGroup);
      break;

    default:
      fn = (node) => {
        return true;
      };
  }
  return fn;
};

export const getLinkVisibilityByState = (visState) => {
  let fn;
  switch (visState) {
    case 'state1':
      fn = (link) => false;
      break;
    case 'state2':
      fn = (link) => link.deg == '1';
      break;
    case 'state3':
    case 'state4':
      fn = (link) => ['1', '2'].includes(link.deg);
      break;

    default:
      fn = (node) => {
        return true;
      };
  }
  return fn;
};

export const getNodeSizeByState = (visState) => {
  let fn;
  switch (visState) {
    case 'state1':
    case 'state2':
      console.log('here');
      fn = (node) => 1;
      break;
    case 'state3':
      console.log('here2');
      fn = (node) => 5;
      break;
    case 'state4':
      console.log('here3');
      fn = (node) => node.r;
      break;
    default:
      console.log('here4');
      fn = (node) => node.r;
  }
  return fn;
};

export const fixNodesByState = (graphData, visState, prevState) => {
  // fix the position of nodes based on what the current, and previous,
  // vis state is/was
  const scrollDir = prevState > visState ? 'up' : 'down';
  console.log('dir', scrollDir);
  // easiest to start by resetting everything
  graphData.nodes.forEach((node) => {
    node.fx = undefined;
    node.fy = undefined;
  });

  if (visState == 'state2' && scrollDir == 'up') {
    let nodes = graphData.nodes.filter((n) => n.nodeGroup === '1');
    nodes.forEach((node) => {
      node.fx = node.x;
      node.fy = node.y;
    });
  }
};

// if ((visStateRef.current === 'state3') & (props.visState === 'state2')) {
//   console.log('3 to 2');
//   graphData.nodes.forEach((node) => {
//     if (node.nodeGroup === '1') {
//       node.fx = node.x;
//       node.fy = node.y;
//     }
//   });
// } else {
//   graphData.nodes.forEach((node) => {
//     node.fx = undefined;
//     node.fy = undefined;
//   });
// }
