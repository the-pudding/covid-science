import {
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceCollide
} from 'd3-force';
import { timeParse } from 'd3-time-format';
import { Utils } from '../../js/Utils.js';

const modernaPMID = '33378609';
const pfizerPMID = '33301246';

export const getForcesByState = (visState, xScale) => {
  switch (visState) {
    case 'state1':
      return [
        {
          name: 'charge',
          force: forceManyBody().strength(-25).distanceMax(500)
        },
        {
          name: 'collide',
          force: forceCollide().radius(5).strength(1)
        },
        {
          name: 'x',
          force: forceX()
            .x((d) => xScale(d['nodeGroup']))
            .strength(0.5)
        },
        {
          name: 'y',
          force: forceY()
            .y((d) => {
              if (d.id === modernaPMID) {
                return -10;
              } else if (d.id === pfizerPMID) {
                return 10;
              } else {
                return 0;
              }
            })
            .strength(0.13)
        }
      ];
    case 'state2':
    case 'state3':
      return [
        {
          name: 'charge',
          force: forceManyBody().strength(-25).distanceMax(500)
        },
        {
          name: 'collide',
          force: forceCollide().radius(5).strength(1)
        },
        {
          name: 'x',
          force: forceX()
            .x((d) => xScale(d['nodeGroup']))
            .strength(0.5)
        },
        {
          name: 'y',
          force: forceY().y(0).strength(0.13)
        }
      ];

    case 'state4': {
      console.log('here');
      return [
        {
          name: 'charge',
          force: forceManyBody().strength(-6).distanceMax(500)
        },
        // {
        //   name: 'charge',
        //   force: forceManyBody().strength(15).distanceMax(500)
        // },
        {
          name: 'x',
          force: forceX()
            .x((d) => xScale(d['nodeGroup']))
            .strength(0.5)
        },
        {
          name: 'y',
          force: forceY().y(0).strength(0.05)
        },
        {
          name: 'collide',
          force: forceCollide()
            .radius((d) => 1.2 * d.r)
            .strength(0.5)
        }
      ];
    }
    case 'state5': {
      return [];
    }
  }
};
