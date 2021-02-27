import {
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceCollide
} from 'd3-force';
import { timeParse } from 'd3-time-format';

const parseDateStr = timeParse('%Y-%m-%d'); // fn for parsing datestring in collaborations data

const modernaPMCID = 'PMC7787219';
const pfizerPMCID = 'PMC7745181';
const spikePMCID = 'PMC7164637';

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
            .x((d) => xScale(d['pubDate']))
            .strength(0.3)
        },
        {
          name: 'y',
          force: forceY()
            .y((d) => (d.id === modernaPMCID ? 0 : 20))
            .strength(0.13)
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
            .x((d) => xScale(d['pubDate']))
            .strength(0.3)
        },
        {
          name: 'y',
          force: forceY()
            .y((d) => {
              if (d.id === modernaPMCID) {
                return 0;
              } else if (d.id === pfizerPMCID) {
                return 100;
              } else {
                return 50;
              }
            })
            .strength(0.13)
        },
        {
          name: 'charge',
          force: forceManyBody().strength(-0.3).distanceMin(2).distanceMax(200)
        },
        {
          name: 'collide',
          force: forceCollide()
            .radius((d) => 5)
            .strength(0.4)
        }
      ];
    }

    case 'state6': {
      return [
        {
          name: 'x',
          force: forceX()
            .x((d) => xScale(d['pubDate']))
            .strength(0.3)
        },
        {
          name: 'y',
          force: forceY()
            .y((d) => {
              if (d.id === spikePMCID) {
                return 200;
              } else {
                return Math.random() * 400;
              }
            })
            .strength(0.13)
        },
        {
          name: 'charge',
          force: forceManyBody().strength(-0.9).distanceMin(2).distanceMax(200)
        },
        {
          name: 'collide',
          force: forceCollide()
            .radius((d) => 5)
            .strength(0.4)
        }
      ];
    }
  }
};
