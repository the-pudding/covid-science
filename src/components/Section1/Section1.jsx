import React, { useState, useEffect, Component } from 'react';
import PapersPerYear from './PapersPerYear.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

import BigNumber from './BigNumber';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

import './Section1.scoped.scss';
import './plot.scss';

export default class Section1 extends Component {
  constructor(props) {
    super(props);

    this.containerRef = React.createRef();

    this.state = {
      plot: null,
      showing2020: false
    };
  }

  handleScrollTrigger = () => {
    let { plot, showing2020 } = this.state;

    const shouldShow2020 = !showing2020;
    if (plot) {
      plot.updatePlot(shouldShow2020);
    }
    this.setState({ showing2020: shouldShow2020 });
  };

  componentDidMount() {
    gsap.to('#revealed-text', {
      scrollTrigger: {
        trigger: '.section1-scroll-container',
        name: 'revealed-text',
        start: '10% top',
        onToggle: this.handleScrollTrigger,
        // markers: {
        //   startColor: 'white',
        //   endColor: 'black'
        // },
        toggleActions: 'play reset reset reset' // onEnter, onLeave, onEnterBack, onLeaveBack,
      },
      duration: 1,
      delay: 0.5,
      text: 'then 2020 happened...'
    });
  }

  componentDidUpdate() {
    let { plot, showing2020 } = this.state;
    if (this.containerRef.current && !plot) {
      this.setState({
        plot: new PapersPerYear(this.containerRef.current, showing2020)
      });
    }
  }

  render() {
    return (
      <section className={this.props.rootClassName}>
        <div className="full-text">
          <h1>Section I</h1>
          <p>
            In under 12 months, the world went from treating the first patients
            presenting with a virus no one had ever seen to watching the first
            shipping trucks full of the vaccine pulling out from loading
            docks.The previous record for developing a vaccine for a new virus
            was 4 years. Behind that accomplishment has been a global hive of
            scientists working to understand the mysteries of COVID-19, how it
            spreads, and how to fight it. That effort involved hundreds of
            thousands of individuals, spread across thousands of institutions,
            in nearly every country around the world, working together, sharing
            information and resources.
          </p>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            quia obcaecati optio nihil impedit deleniti repellat dolores facilis
            amet? Ex et aliquam recusandae pariatur vel dolorum, explicabo ipsa
            quae dolor.
          </p>
        </div>
        <div className="section1-scroll-container">
          <div className="content-container">
            <div className="plot-container" ref={this.containerRef}>
              {' '}
            </div>

            <div className="text-overlay-container">
              <div className="plot-text">
                SARS-COV2 belongs to a class of viruses we have seen
                before.Coronaviruses were first characterized in the mid-1960s,
                but did not receive much research attention until the early
                2000s, following the SARS outbreak (2002), and then later the
                MERS outbreak (2012).
                <br></br>
                <br></br>
                By 2019, there were ~5000 publications on coronaviruses coming
                out per year.
              </div>
              <div id="revealed-text"></div>
            </div>
          </div>
        </div>

        <div className="full-text">
          <p>
            During the initial panic and uncertainty of 2020 (before we started
            hoarding toilet paper) labs shelved ongoing projects and pivoted to
            full-time individual labs, research programs, funding agencies...
          </p>
        </div>
        <div className="big-number-container">
          <BigNumber align="left" value="96k" units="articles" />
          <BigNumber align="left" value="6799" units="journals" />
          <BigNumber align="left" value="203" units="countries" />
          <BigNumber align="left" value="11.03" units="articles per hour" />
          {/* <BigNumber
            align="left"
            value="5min 33s"
            units="rate of new articles"
          /> */}
        </div>
      </section>
    );
  }
}
