import {
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceCollide
} from 'd3-force';

const modernaPMCID = 'PMC7787219';
const pfizerPMCID = 'PMC7745181';

export const getForcesByState = (visState, xScale) => {
  switch (visState) {
    case 'state1':
      return [
        {
          name: 'center',
          force: forceCenter(window.innerWidth / 2, window.innerHeight / 2)
        },
        {
          name: 'collide',
          force: forceCollide().radius(5).strength(1)
        }
      ];

    case 'std': {
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
              // console.log(d);
              if (d.id === modernaPMCID) {
                return 200;
              } else if (d.id === pfizerPMCID) {
                return 400;
              } else {
                return 300;
                //return Math.random() * 100 + 250;
              }
            })
            .strength(0.13)
        },
        {
          name: 'charge',
          force: forceManyBody().strength(-0.3).distanceMin(2).distanceMax(200)
        },
        {
          name: 'collision',
          force: forceCollide()
            .radius((d) => 5)
            .strength(0.4)
        }
      ];
    }
  }
};
