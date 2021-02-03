import React, { useState, useEffect } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import './Section1.scss';
import { _sortPropTweensByPriority } from 'gsap/gsap-core';

const Section1 = (props) => {
  const toggleBackground = () => {
    console.log('clicked');
  };

  useEffect(() => {
    // console.log('effected');
    // ScrollTrigger.create({
    //   trigger: 'section-1',
    //   onEnter: () => props.onSectionUpdate('section-1'),
    //   onEnterBack: () => props.onSectionUpdate('section-1')
    // });
    // gsap.to('.test-box', {
    //   scrollTrigger: {
    //     trigger: '.test-box',
    //     start: 'top center',
    //     markers: true,
    //     scrub: 1,
    //     toggleActions: 'restart pause reverse reset' // onEnter, onLeave, onEnterBack, onLeaveBack,
    //   },
    //   top: 400,
    //   duration: 3
    // });
  });

  return (
    <section className={props.rootClassName}>
      <h1>Section I</h1>
      <div className="content">
        <div className="text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus
          sequi et, similique molestias placeat officia harum blanditiis in
          numquam nemo natus perferendis minima dicta incidunt impedit
          voluptates assumenda cum. Magni?
        </div>
        <button onClick={() => toggleBackground()}>Click me</button>
      </div>

      <div className="test-box"></div>
    </section>
  );
};

export default Section1;
