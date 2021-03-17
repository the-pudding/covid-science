import React, { useEffect, useRef, useState } from 'react';
import CiteGraph from './CiteGraph';
import GraphNarrative from './GraphNarrative';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './Section3.scoped.scss';

gsap.registerPlugin(ScrollTrigger);

const Section3 = (props) => {
  const [currentVisState, setVisState] = useState('state1');

  const visStates = ['state1', 'state2', 'state3', 'state4'];
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
      <div className="narrative-text">
        <h1>Section III</h1>
        <p>
          Science is incremental, and often times the major headline-grabbing
          results are just the peak of a mountain of research that came before.
          Each new published result contributes to the shared body of knowledge,
          but also prompts new questions and enables future research to branch
          off along new lines of inquiry. Within an article, relevant prior work
          is acknowledged via citations, and by tracing the lineage of cited
          articles, the contours of the mountain of previous research begins to
          appear.
        </p>
      </div>
      <div className="section3-scroll-container">
        <div className="graph-container">
          <GraphNarrative visState={currentVisState} />
          <CiteGraph visState={currentVisState} />
        </div>
        {visStateDivs}
      </div>
    </section>
  );
};

export default Section3;
