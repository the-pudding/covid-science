import { hot } from 'react-hot-loader/root';
import React, { Suspense, lazy, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import World from './components/World';
import SectionHero from './components/SectionHero/SectionHero';
import Section1 from './components/Section1/Section1';

// --- Set up remaining section components to lazy load
import useIntersectionObserver from './components/useIntersectionObserver';
// const Section1 = lazy(() =>
//   import(/* webpackChunkName: "Section1" */ './components/Section1/Section1')
// );
const Section2 = lazy(() =>
  import(/* webpackChunkName: "Section2" */ './components/Section2/Section2')
);
const Section3 = lazy(() =>
  import(/* webpackChunkName: "Section3" */ './components/Section3/Section3')
);
const SectionMethods = lazy(() =>
  import(
    /* webpackChunkName: "SectionMethods" */ './components/SectionMethods/SectionMethods'
  )
);
const Footer = lazy(() =>
  import(/* webpackChunkName: "Footer" */ './components/Footer/Footer')
);

// --- assets
import logo from './assets/puddingLogo.svg';

// --- styles
import './styles/style.scss';

// default scroll trigger
// ScrollTrigger.defaults({
//   markers: {
//     startColor: 'white',
//     endColor: 'black'
//   }
// });

const sections = [
  'section-hero',
  'section-1',
  'section-2',
  'section-3',
  'section-methods'
];

const App = () => {
  const [currentSection, setCurrentSection] = useState('section-hero');

  // create intersection observers for each section after section1
  const obs_section2 = useRef(null);
  const obs_section3 = useRef(null);
  const obs_sectionMethods = useRef(null);
  const obs_footer = useRef(null);
  const isSection2Visible = useIntersectionObserver(obs_section2);
  const isSection3Visible = useIntersectionObserver(obs_section3);
  const isSectionMethodsVisible = useIntersectionObserver(obs_sectionMethods);
  const isFooterVisible = useIntersectionObserver(obs_footer);

  // add a scroll trigger to toggle between hero and section-1
  useEffect(() => {
    ['section-hero', 'section-1'].map((section, idx) => {
      ScrollTrigger.create({
        trigger: `.${section}`, // trigger on class named `section`
        start: `top ${section === 'section-1' ? '90%' : '66%'}`,
        onEnter: () => handleSectionUpdate(idx),
        onLeaveBack: () => handleSectionUpdate(idx - 1)
      });
    });
  }, []);

  const handleSectionUpdate = (sectionIdx) => {
    setCurrentSection(sections[sectionIdx]);
  };

  return (
    <div className="App">
      <div className="logo-container">
        <a href="https://pudding.cool" target="_blank">
          <img src={logo} alt="The Pudding" className="logo-full"></img>
        </a>
      </div>

      <div className="narrative-sections">
        <section>
          <SectionHero rootClassName="section-hero" />
        </section>
        <section>
          <Section1 rootClassName="section-1" />
        </section>

        {/* Section 2 */}
        <section ref={obs_section2}>
          {isSection2Visible && (
            <Suspense fallback={<div className="loading"></div>}>
              <Section2 rootClassName="section-2" />
            </Suspense>
          )}
        </section>

        {/* Section 3 */}
        <section ref={obs_section3}>
          {isSection3Visible && (
            <Suspense fallback={<div className="loading"></div>}>
              <Section3 rootClassName="section-3" />
            </Suspense>
          )}
        </section>

        {/* Section Methods */}
        <section ref={obs_sectionMethods}>
          {isSectionMethodsVisible && (
            <Suspense fallback={<div className="loading"></div>}>
              <SectionMethods rootClassName="section-methods" />
            </Suspense>
          )}
        </section>
      </div>

      <section ref={obs_footer}>
        {isFooterVisible && (
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Footer />
          </Suspense>
        )}
      </section>

      <World currentSection={currentSection} />
    </div>
  );
};

export default hot(App);
