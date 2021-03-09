import React, { Component } from 'react';
import * as Papa from 'papaparse';
import { scaleTime } from 'd3-scale';
import { timeFormat, timeParse } from 'd3-time-format';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TimelineScrubber from './TimelineScrubber';
import CollabMap from './CollabMap';
import BigNumber from './BigNumber';

import statsByDayCSV from './assets/statsByDay.csv';

import mapKeyImg from './assets/mapKeySkewed.png';
import './Section2.scoped.scss';
import './TimelineScrubber.scss';

gsap.registerPlugin(ScrollTrigger);

const parseDateStr = timeParse('%Y-%m-%d'); // fn for parsing datestring in collaborations data
const formatDate = timeFormat('%Y-%m-%d');

const intervalWin = 10; // how many days to show on the map at once

export default class Section2 extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();

    this.state = {
      scrubber: null,
      currentDate: parseDateStr('2020-01-01'),
      totalArticles: 0,
      totalCollabs: 0,
      statsByDay: null
    };

    // scale to map scroll progress to dates
    this.tlScale = scaleTime()
      .domain([parseDateStr('2020-01-01'), parseDateStr('2020-12-31')])
      .range([0, 1]);
  }

  handleScrollTrigger = (progress) => {
    let { scrubber, statsByDay } = this.state;

    // map scroll progress to date
    const currentDate = this.tlScale.invert(progress);
    this.setState({ currentDate });

    // update timeline scrubber
    if (scrubber) {
      scrubber.updatePlot(currentDate);
    }

    // get the total N of articles and collabs based on current date
    if (statsByDay) {
      const currentDateStr = formatDate(currentDate);
      const bigNumStats = statsByDay.filter(
        (d) => d.pubDate === currentDateStr
      );
      this.setState({
        totalArticles: bigNumStats[0].nArts,
        totalCollabs: bigNumStats[0].nCollabs
      });
    }
  };

  componentDidMount() {
    let { scrubber } = this.state;

    // set up scroll trigger to update based on progress
    ScrollTrigger.create({
      trigger: '.section2-scroll-container',
      start: 'top top',
      end: 'bottom-=500 bottom',
      // markers: true,
      scrub: 3,
      onUpdate: (self) => {
        this.handleScrollTrigger(self.progress);
      }
    });

    // gsap.to('.section2-scroll-container', {
    //   scrollTrigger: {
    //     trigger: '.section2-scroll-container',
    //     start: 'bottom-=400 bottom',
    //     end: 'bottom-=100 bottom',
    //     // toggleActions: 'play complete reverse reverse',
    //     scrub: true
    //   },
    //   opacity: 0,
    //   duration: 1
    // });

    // HACKY SOLUTION TO GET SCROLL TRIGGERS TO UPDATE TO CORRECT POSITION
    setTimeout(() => {
      console.log('refresing');
      ScrollTrigger.refresh();
    }, 2000);

    // parse the statsByDay csv file and add to state
    let statsByDay = statsByDayCSV.slice(1).map((d) => {
      return {
        pubDate: `2020-${d[0]}`,
        nArts: +d[1],
        nCollabs: +d[2],
        nGeoCollabs: +d[3]
      };
    });
    this.setState({ statsByDay });
  }

  componentDidUpdate() {
    let { scrubber } = this.state;
    if (this.containerRef.current && !scrubber) {
      this.setState({
        scrubber: new TimelineScrubber(this.containerRef.current, intervalWin)
      });
    }
  }

  render() {
    let { currentDate, totalArticles, totalCollabs } = this.state;

    return (
      <section className={this.props.rootClassName}>
        <div className="full-text">
          <h1>Section II</h1>
          <p>
            2020 was a year of shut downs. Nations closed boarders, states
            closed schools, cities shuttered businesses. Individual households
            had to close their doors to neighbors, family and friends.
          </p>

          <p>
            But in that time of retreating inward, the scientific community
            expanded outward. Individuals worked together in their own labs, but
            also collaborated across laboratories, across difference cities,
            across different countries. A given scientific paper almost always
            has more than one author.Much like the virus itself, scientific
            collaborations stretched easily across geopolitical boarders. It’s
            not juts that individuals were working on this. Labs across the
            world worked together on the same problems. Enter into [EXAMPLE]
          </p>

          <div className="key-container">
            <img className="map-key-image" src={mapKeyImg}></img>
          </div>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi
            alias assumenda odio libero quia repudiandae debitis omnis labore
            provident, similique enim, reiciendis voluptatem veniam ducimus
            quod! Totam possimus rerum maiores.
          </p>
        </div>
        <div className="section2-scroll-container">
          <div className="map-container">
            <div className="scrubber-container" ref={this.containerRef}>
              <div className="scrubber-overlay"></div>
            </div>
            <div className="big-number-container">
              <BigNumber
                align="left"
                value={totalArticles}
                units="total articles"
              />
              <BigNumber
                align="right"
                value={totalCollabs}
                units="total collaborations"
              />
            </div>

            <CollabMap currentDate={currentDate} intervalWin={intervalWin} />
          </div>
        </div>
      </section>
    );
  }
}
