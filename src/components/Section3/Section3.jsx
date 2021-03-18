import React, { useEffect, useRef, useState } from 'react';
import CiteGraph from './CiteGraph';
import GraphNarrative from './GraphNarrative';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './Section3.scoped.scss';

gsap.registerPlugin(ScrollTrigger);
const visStates = ['state1', 'state2', 'state3', 'state4'];

const Section3 = (props) => {
  const [currentVisState, setVisState] = useState('state1');

  const visStateDivs = visStates.map((d, i) => (
    <div key={i} className={`visState ${d}`}></div>
  ));

  useEffect(() => {
    // add a scroll trigger to each vis state div
    visStates.forEach((visState, idx) => {
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

  useEffect(() => {
    // hacky solution to get the scroll trigger positions to update to the proper locations
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 3000);
  }, []);

  const updateState = (idx) => {
    if (idx >= 0) {
      setVisState(visStates[idx]);
    }
  };

  return (
    <section className={props.rootClassName}>
      <div className="narrative-text">
        <div className="section-break"></div>
        <p>
          Science is incremental, and the major headline-grabbing findings
          always stand on the shoulders of years of discoveries that came
          before. The time it took to develop vaccines for COVID-19 obliterated
          previous records — not because it was rushed, but because of the head
          start afforded by decades of prior research on other coronaviruses. By
          mid-March 2020, before most US cities had even announced their first
          lock downs, the first vaccine candidate was already{' '}
          <a href="https://www.nih.gov/news-events/news-releases/nih-clinical-trial-investigational-vaccine-covid-19-begins">
            entering clinical trial.{' '}
          </a>
        </p>
        <p>
          Research articles formally acknowledge previous work via citations,
          which, when tracked, can establish the lineage of a scientific
          discovery. By tracing the lineage of an article's citations, you can
          begin to reveal the contours of the mountains of research that came
          before.
        </p>
      </div>
      <div className="section3-scroll-container">
        <div className="graph-container">
          <GraphNarrative visState={currentVisState} />
          <CiteGraph visState={currentVisState} />
        </div>
        {visStateDivs}
      </div>
      <div className="narrative-text">
        <div className="section-break"></div>
        <p>
          The extraordinary challenges of 2020 called for extraordinary
          responses. 2020 caught everyone off guard, except of course the cadre
          of scientists and global health experts who had been warning this type
          of pandemic could come, and whose research gave us a leg up when it
          finally did. The work done ahead of time, coupled with the pivoting of
          resources to focus on a singular goal, have collectively enabled us to
          begin imagining a time beyond COVID-19. Confronted with the challenges
          of fighting an unknown virus, the science and medical communities dug
          in and armed themselves with the only tool that's saved us from
          similar challenges in the past: empirical research. Research is
          getting us out of the pandemic, and will better prepare us for
          whatever comes next.
        </p>
      </div>
    </section>
  );
};

export default Section3;
