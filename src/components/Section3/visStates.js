// return the force graph properties for the given visState
// props should include: 'centerAt', 'zoom', 'forcesArr'
import { getForcesByState } from './forces';
import { timeParse } from 'd3-time-format';

const parseDateStr = timeParse('%Y-%m-%d'); // fn for parsing datestring in collaborations data

export const getVisStateProps = (visState, xScale) => {
  switch (visState) {
    case 'state1':
      return {
        centerAt: [xScale(parseDateStr('2020-12-20')), 10],
        zoom: 5,
        forcesArr: getForcesByState(visState, xScale)
      };

    case 'state2':
      return {
        centerAt: [xScale(parseDateStr('2020-07-20')), 50],
        zoom: 1.8,
        forcesArr: getForcesByState('state2', xScale)
      };

    case 'state3':
      return {
        centerAt: [xScale(parseDateStr('2020-07-20')), 50],
        zoom: 1.5,
        forcesArr: getForcesByState('state3', xScale)
      };

    case 'state4':
      return {
        centerAt: [xScale(parseDateStr('2020-07-01')), 50],
        zoom: 1.5,
        forcesArr: getForcesByState('state4', xScale)
      };

    case 'state5':
      return {
        centerAt: [xScale(parseDateStr('2020-03-19')), 50],
        zoom: 5,
        forcesArr: getForcesByState('state5', xScale)
      };

    case 'state6':
      return {
        centerAt: [xScale(parseDateStr('2020-07-20')), 200],
        zoom: 1.5,
        forcesArr: getForcesByState('state6', xScale)
      };

    default:
      return {
        centerAt: [100, 400],
        zoom: 1,
        forcesArr: getForcesByState('std', xScale)
      };
  }
};
