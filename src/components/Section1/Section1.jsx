import React, { useState, useEffect, Component } from 'react';
import PapersPerYear from './PapersPerYear.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

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
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus
            sequi et, similique molestias placeat officia harum blanditiis in
            numquam nemo natus perferendis minima dicta incidunt impedit
            voluptates assumenda cum. Magni? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Doloribus sequi et, similique
            molestias placeat officia harum blanditiis in numquam nemo natus
            perferendis minima dicta incidunt impedit voluptates assumenda cum.
            Magni?
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi
            alias assumenda odio libero quia repudiandae debitis omnis labore
            provident, similique enim, reiciendis voluptatem veniam ducimus
            quod! Totam possimus rerum maiores.
          </p>
        </div>
        <div className="section1-scroll-container">
          <div className="content-container">
            <div className="plot-container" ref={this.containerRef}>
              {' '}
            </div>

            <div className="text-overlay-container">
              <div className="plot-text">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Doloribus sequi et, similique molestias placeat officia harum
                blanditiis in numquam nemo natus perferendis minima dicta
                incidunt impedit voluptates assumenda cum. Magni? Lorem ipsum
                dolor sit amet, consectetur adipisicing elit.
              </div>
              <div id="revealed-text"></div>
            </div>
          </div>
        </div>

        <div className="full-text">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus
            sequi et, similique molestias placeat officia harum blanditiis in
            numquam nemo natus perferendis minima dicta incidunt impedit
            voluptates assumenda cum. Magni? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Doloribus sequi et, similique
            molestias placeat officia harum blanditiis in numquam nemo natus
            perferendis minima dicta incidunt impedit voluptates assumenda cum.
            Magni?
          </p>
        </div>
      </section>
    );
  }
}
