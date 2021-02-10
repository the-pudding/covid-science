import React, { useState, useEffect } from 'react';
// import Plot from './Plot';
import PapersPerYear from './PapersPerYear.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

import './Section1.scss';

const Section1 = (props) => {
  const containerRef = React.useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const plot = new PapersPerYear(containerRef.current);
    }
  }, []);

  useEffect(() => {
    gsap.to('#revealed-text', {
      scrollTrigger: {
        trigger: '.section-content',
        name: 'revealed-text',
        start: '60% center',
        onToggle: () => {
          console.log('toggled');
        },
        markers: {
          startColor: 'white',
          endColor: 'black'
        },
        toggleActions: 'play reset reset reset' // onEnter, onLeave, onEnterBack, onLeaveBack,
      },
      duration: 1,
      text: 'then 2020 came...'
    });
  }, []);

  return (
    <section className={props.rootClassName}>
      <h1>Section I</h1>
      <div className="section-content">
        <div className="text-container">
          <div className="centered-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus
            sequi et, similique molestias placeat officia harum blanditiis in
            numquam nemo natus perferendis minima dicta incidunt impedit
            voluptates assumenda cum. Magni? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Doloribus sequi et, similique
            molestias placeat officia harum blanditiis in numquam nemo natus
            perferendis minima dicta incidunt impedit voluptates assumenda cum.
            Magni?
          </div>
          <div id="revealed-text" className="centered-text"></div>
        </div>

        <div className="plot-container" />
      </div>
    </section>
  );
};

export default Section1;
