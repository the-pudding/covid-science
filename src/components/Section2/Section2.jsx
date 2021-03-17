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
import collabKeyImg from './assets/authorCollabsKey.svg';
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
      if (currentDateStr === '2020-12-31') {
        bigNumStats[0].nArts = 93593;
      }
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
        <div className="narrative-text">
          <h1>Section II</h1>
          <p>
            This body of literature not only reflects the sheer volume of
            COVID-19 related research that occurred, but also the manner in
            which that work took place. While the rest of the world was shutting
            down — nations closing borders, states closing schools, cities
            shuttering businesses - the science and medical communities were
            expanding outward, and forming collaborations that spanned
            institutions and international borders.
          </p>

          <p>
            The extent of these collaborations is reflected in the list of
            authors contributing to each research article. For instance, the
            article{' '}
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7836404/"
              target="_blank"
            >
              <i>
                Characterizing Wuhan residents' mask-wearing intention at early
                stages of the COVID-19 pandemic
              </i>
            </a>{' '}
            has 4 authors:
          </p>

          <div className="author-list-container">
            <ul className="author-list">
              <li>
                <mark>Min Zhou</mark> -{' '}
                <span>
                  Hunan University of Technology and Business, Changsha, China
                </span>
              </li>
              <li>
                <mark>Piao Long</mark> -{' '}
                <span>
                  Hunan University of Technology and Business, Changsha, China
                </span>
              </li>
              <li>
                <mark>Nan Kong</mark> -{' '}
                <span>Purdue University, West Lafayette, Indiana, USA</span>
              </li>
              <li>
                <mark>Kathryn S. Campy</mark> -{' '}
                <span>
                  University of Pennsylvania, Philadelpha, Pennsylvania, USA
                </span>
              </li>
            </ul>
          </div>

          <p className="short-text">
            Which represents <mark>6</mark> collaborations between pairs of
            researchers.
          </p>
          <div className="key-container">
            <img
              alt="Illustration depicting 4 authors with links connecting each pair of authors"
              className="collab-key-image"
              src={collabKeyImg}
            ></img>
          </div>

          <p className="short-text">
            These collaborations link institutions spanning <mark>3</mark>{' '}
            cities around the world.
          </p>
          <div className="key-container">
            <img
              alt="World map with arcs connecting West Lafayette, Philadelphia, and Changsha"
              className="map-key-image"
              src={mapKeyImg}
            ></img>
          </div>

          <p>
            Using this same approach on the entire collection of articles, we
            can look at how these collaborations unfolded throughout the year
            around the globe.
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
