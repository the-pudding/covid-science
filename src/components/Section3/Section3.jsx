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
    <div className={props.rootClassName}>
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
          <a
            href="https://www.nih.gov/news-events/news-releases/nih-clinical-trial-investigational-vaccine-covid-19-begins"
            target="_blank"
          >
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
          Confronted with the challenges of fighting an unknown virus, the
          scientific and medical communities dug in and armed themselves with
          the tool that's gotten us through similar challenges in the past:
          empirical research. New viruses prompt new questions, and the only way
          to answer these questions is by collecting the data, analyzing
          results, sharing findings, and debating the implications. The process
          is demanding, laborious, and meticulously methodical (read: slow). The
          volumes of information learned about COVID-19 in such a short time
          span are a testament to the scale of the research effort throughout
          2020 and continuing today. The foundational research on earlier
          coronaviruses, coupled with the shift in resources and focus at the
          start of 2020, has enabled us to begin imagining a time beyond
          COVID-19. And will better prepare us for whatever comes next.
        </p>
      </div>
    </div>
  );
};

export default Section3;
