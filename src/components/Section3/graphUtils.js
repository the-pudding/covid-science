import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import _exports from '../../styles/_exports.module.scss';

export const getNodeVisibilityByState = (visState) => {
  let fn;
  switch (visState) {
    case 'state1':
      fn = (node) => ['0', '9'].includes(node.nodeGroup);
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

// ----
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
      fn = (link) => {
        return true;
      };
  }
  return fn;
};

// ----
export const getNodeSizeByState = (visState) => {
  let fn;
  switch (visState) {
    case 'state1':
      fn = (node) => 25;
    case 'state2':
      fn = (node) => 25;
      break;
    case 'state3':
      fn = (node) => 25;
      break;
    case 'state4':
      fn = (node) => Math.PI * node.r ** 2;
      break;
    default:
      fn = (node) => node.r;
  }
  return fn;
};

// ----
const fontScale = scaleLinear().domain([1000, 14000]).range([10, 20]);
export const getNodeObjByState = (visState, hoveredNode) => {
  let fn;
  switch (visState) {
    case 'state4':
      fn = (node, ctx, globalScale) => {
        const { nCitedBy, x, y } = node;
        if (nCitedBy < 1000) {
          // <- set threshold for printing values or not
          return null;
        }
        const fontSize = fontScale(nCitedBy) / globalScale;
        ctx.font = `${fontSize}px Theinhardt-Med`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle =
          node === hoveredNode ? _exports.bgColor : _exports.textColor;

        // set label
        const label = nCitedBy < 1000 ? nCitedBy : format('.2s')(nCitedBy); // format SI
        ctx.fillText(label, x, y);
      };
      break;
    default:
      fn = () => null;
  }
  return fn;
};

// ----
const generateToolTip = (node, includeCitedBy = false) => {
  if (includeCitedBy) {
    return `
    <div class="cite-graph-tooltip-container ${
      node.nodeGroup === '0' ? 'left' : ''
    }">
      <div class="title">${node.title}</div>
      <div class="journal">${node.journal} <span>(${node.pubYear})</span></div>
      <div class="break"></div>
      <div class="cited-by">cited by <span>${node.nCitedBy.toLocaleString()}</span> articles</div>
    </div>`;
  } else {
    return `
        <div class="cite-graph-tooltip-container ${
          node.nodeGroup === '0' ? 'left' : ''
        }">
          <div class="title">${node.title}</div>
          <div class="journal">${node.journal} <span>(${
      node.pubYear
    })</span></div>
        </div>`;
  }
};
export const getNodeTooltipByState = (visState) => {
  let fn;
  switch (visState) {
    case 'state1':
    case 'state2':
    case 'state3':
      fn = (node) => {
        return generateToolTip(node, false);
      };
      break;
    case 'state4':
      fn = (node) => {
        return generateToolTip(node, true);
      };
      break;
    default:
      fn = () => null;
  }
  return fn;
};

// ----
export const fixNodesByState = (graphData, visState, prevState) => {
  // fix the position of nodes based on what the current, and previous,
  // vis state is/was
  const scrollDir = prevState > visState ? 'up' : 'down';
  // easiest to start by resetting everything
  graphData.nodes.forEach((node) => {
    node.fx = undefined;
    node.fy = undefined;
  });

  // DEBUGING
  let nodes = graphData.nodes.filter((n) => n.nodeGroup == '9');
  nodes.forEach((node, i) => {
    switch (i) {
      case 0:
        node.fx = 0;
        node.fy = -500;
        break;
      case 1:
        node.fx = 1000;
        node.fy = -500;
        break;
      case 2:
        node.fx = 1000;
        node.fy = 500;
        break;
      case 3:
        node.fx = 0;
        node.fy = 500;
        break;
    }
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
