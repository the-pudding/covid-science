import React, { Component } from 'react';
import * as Papa from 'papaparse';
import { timeParse } from 'd3-time-format';
import { scaleTime } from 'd3-scale';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './Section2.scoped.scss';
import TimelineScrubber from './TimelineScrubber';

gsap.registerPlugin(ScrollTrigger);

const parseDateStr = timeParse('%Y-%m-%d'); // fn for parsing datestring in collaborations data

export default class Section2 extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();

    this.state = {
      collaborations: null,
      scrubber: null
    };

    // scale to map scroll progress to dates
    this.tlScale = scaleTime()
      .domain([new Date('01-01-2020'), new Date('12-31-2020')])
      .range([0, 1]);
  }

  handleScrollTrigger = (progress) => {
    // map scroll progress to date, and update children
    let { scrubber } = this.state;

    if (scrubber) {
      scrubber.updatePlot(this.tlScale.invert(progress));
    }
  };

  componentDidMount() {
    let { scrubber } = this.state;
    // Load the collaborations data (hosted externally)
    // Papa.parse(
    //   'https://raw.githubusercontent.com/jeffmacinnes/COVID_vis/master/websiteData/collabsByDate.csv',
    //   {
    //     download: true,
    //     header: true,
    //     worker: true,
    //     fastMode: true,
    //     // step: function () {
    //     //   console.log('row');
    //     // },
    //     complete: (results) => {
    //       console.log('downloaded');
    //       const parsedCollabs = results.data.map((d) => {
    //         return {
    //           pubDate: parseDateStr(`2020-${d['pubDate']}`),
    //           srcIdx: +d['srcIdx'],
    //           dstIdx: +d['dstIdx']
    //         };
    //       });
    //       this.setState({
    //         collaborations: parsedCollabs
    //       });
    //       console.log('processed');
    //     }
    //   }
    // );

    // set up scroll trigger to update based on progress
    ScrollTrigger.create({
      trigger: '.section2-scroll-container',
      start: 'top top',
      end: '+=800',
      markers: {
        startColor: 'white',
        endColor: 'black'
      },
      onUpdate: (self) => {
        this.handleScrollTrigger(self.progress);
      }
    });
  }

  componentDidUpdate() {
    let { scrubber } = this.state;
    if (this.containerRef.current && !scrubber) {
      console.log('here');
      this.setState({
        scrubber: new TimelineScrubber(this.containerRef.current)
      });
    }
  }

  render() {
    return (
      <section className={this.props.rootClassName}>
        <h1>Section II</h1>
        <div className="section2-scroll-container">
          <div className="content-container">
            {/* Timeline Scrubber */}
            <div className="scrubber-container" ref={this.containerRef}>
              <div className="scrubber-overlay"></div>
            </div>

            {/* Text content */}
          </div>
        </div>
      </section>
    );
  }
}
