// return the force graph properties for the given visState
// props should include: 'centerAt', 'zoom', 'forcesArr'
import { getForcesByState } from './forces';

const getZoom = (state) => {
  // return a zoom based on different screen widths to
  // ensure all of the nodes are shown on the screen
  const w = window.innerWidth;

  switch (state) {
    case 'state1':
      if (w >= 960) {
        return 5;
      }
      if ((w >= 480) & (w < 960)) {
        return 4;
      }
      if (w < 480) {
        return 3;
      }
      break;
    case 'state2':
      if (w >= 960) {
        return 1.5;
      }
      if ((w >= 480) & (w < 960)) {
        return 1.25;
      }
      if (w < 480) {
        return 0.65;
      }
      break;
    case 'state3':
      if (w >= 960) {
        return 0.8;
      }
      if ((w >= 480) & (w < 960)) {
        return 0.6;
      }
      if (w < 480) {
        return 0.35;
      }
      break;
    case 'state4':
      if (w >= 960) {
        return 0.65;
      }
      if ((w >= 480) & (w < 960)) {
        return 0.5;
      }
      if (w < 480) {
        return 0.3;
      }
      break;
  }
};

export const getVisStateProps = (visState, xScale) => {
  switch (visState) {
    case 'state1':
      return {
        centerAt: [xScale(-0.1), 0],
        zoom: getZoom(visState),
        forcesArr: getForcesByState(visState, xScale)
      };

    case 'state2':
      return {
        centerAt: [xScale(0.5), 0],
        zoom: getZoom(visState),
        forcesArr: getForcesByState('state2', xScale)
      };

    case 'state3':
      return {
        centerAt: [xScale(1), 0],
        zoom: getZoom(visState),
        forcesArr: getForcesByState('state3', xScale)
      };

    case 'state4':
      return {
        centerAt: window.innerWidth >= 960 ? [xScale(1), 0] : [xScale(1.3), 0],
        zoom: getZoom(visState),
        forcesArr: getForcesByState('state4', xScale)
      };

    // case 'state5':
    //   return {
    //     centerAt: [xScale(1), 50],
    //     zoom: 5,
    //     forcesArr: getForcesByState('state5', xScale)
    //   };

    default:
      return {
        centerAt: [xScale(1), 0],
        zoom: 0.65,
        forcesArr: getForcesByState('state1', xScale)
      };
  }
};
