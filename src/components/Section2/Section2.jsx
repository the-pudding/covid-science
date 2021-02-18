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

import './Section2.scoped.scss';

gsap.registerPlugin(ScrollTrigger);

const parseDateStr = timeParse('%Y-%m-%d'); // fn for parsing datestring in collaborations data
const formatDate = timeFormat('%Y-%m-%d');

export default class Section2 extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();

    this.state = {
      scrubber: null,
      currentDate: parseDateStr('01-01-2020'),
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
      end: '+=800',
      markers: {
        startColor: 'white',
        endColor: 'black'
      },
      onUpdate: (self) => {
        this.handleScrollTrigger(self.progress);
      }
    });

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
        scrubber: new TimelineScrubber(this.containerRef.current)
      });
    }
  }

  render() {
    let { currentDate, totalArticles, totalCollabs } = this.state;

    return (
      <section className={this.props.rootClassName}>
        <h1>Section II</h1>
        <div className="section2-scroll-container">
          <div className="map-container">
            <div className="scrubber-container" ref={this.containerRef}>
              <div className="scrubber-overlay"></div>
            </div>
            <div className="big-number-container">
              <BigNumber value={totalArticles} units="total articles" />
              <BigNumber value={totalCollabs} units="total collaborations" />
            </div>

            <CollabMap currentDate={currentDate} />
          </div>

          <div className="content-container"></div>
        </div>
      </section>
    );
  }
}
