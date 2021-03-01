import {
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceCollide
} from 'd3-force';
import { timeParse } from 'd3-time-format';
import { Utils } from '../../js/Utils.js';

export const getForcesByState = (visState, xScale) => {
  switch (visState) {
    case 'state1':
      return [
        {
          name: 'collide',
          force: forceCollide().radius(5).strength(1)
        },
        {
          name: 'x',
          force: forceX()
            .x((d) => xScale(d['nodeGroup']))
            .strength(0.3)
        },
        {
          name: 'y',
          force: forceY().y(0).strength(0.13)
        }
      ];
    case 'state2':
    case 'state3':
    case 'state4':
    case 'state5': {
      return [
        {
          name: 'x',
          force: forceX()
            .x((d) => xScale(d['nodeGroup']))
            .strength(0.3)
        },
        {
          name: 'y',
          force: forceY().y(0).strength(0.13)
        },
        {
          name: 'collide',
          force: forceCollide().radius(5).strength(0.4)
        }
      ];
    }
  }
};
