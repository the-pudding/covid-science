import React, { useEffect, useRef, useState } from 'react';
import CiteGraph from './CiteGraph';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './Section3.scoped.scss';

gsap.registerPlugin(ScrollTrigger);

const Section3 = (props) => {
  const [currentVisState, setVisState] = useState('state1');

  const visStates = ['state1', 'state2', 'state3', 'state4', 'state5'];
  const visStateDivs = visStates.map((d, i) => (
    <div key={i} className={`visState ${d}`}></div>
  ));

  const handleScrollTrigger = (progress) => {
    console.log(progress);
  };

  const updateState = (idx) => {
    if (idx >= 0) {
      setVisState(visStates[idx]);
    }
  };

  useEffect(() => {
    // add a scroll trigger to each vis state div
    visStates.map((visState, idx) => {
      ScrollTrigger.create({
        trigger: `.${visState}`,
        start: 'top center',
        end: 'bottom center',
        // markers: {
        //   startColor: 'white',
        //   endColor: 'black'
        // },
        onEnter: () => updateState(idx),
        onLeaveBack: () => updateState(idx - 1)
      });
    });
  }, []);

  return (
    <section className={props.rootClassName}>
      <div className="full-text">
        <h1>Section III</h1>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
          praesentium, deleniti voluptatum quis laborum ea enim assumenda error
          natus iusto magnam harum veritatis officiis asperiores. Quia,
          praesentium! Maxime, quia! Saepe!
        </div>
      </div>
      <div className="section3-scroll-container">
        <div className="graph-container">
          <CiteGraph visState={currentVisState} />
        </div>
        {visStateDivs}
      </div>
    </section>
  );
};

export default Section3;
