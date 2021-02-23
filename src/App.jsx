import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import World from './components/World';
import SectionHero from './components/SectionHero/SectionHero';
import Section1 from './components/Section1/Section1';
import Section2 from './components/Section2/Section2';
import Section3 from './components/Section3/Section3';
import SectionMethods from './components/SectionMethods/SectionMethods';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import './styles/style.scss';

// default scroll trigger
// ScrollTrigger.defaults({
//   markers: {
//     startColor: 'white',
//     endColor: 'black'
//   }
// });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSection: 'section-hero',
      sections: [
        'section-hero',
        'section-1',
        'section-2',
        'section-3',
        'section-methods'
      ]
    };
  }

  handleSectionUpdate = (sectionIdx) => {
    const { sections } = this.state;
    this.setState({ currentSection: sections[sectionIdx] });
  };

  componentDidMount() {
    // add a scroll trigger for each section
    const { sections } = this.state;
    sections.map((section, idx) => {
      ScrollTrigger.create({
        trigger: `.${section}`, // trigger on class named `section`
        start: 'top 66%',
        onEnter: () => this.handleSectionUpdate(idx),
        onLeaveBack: () => this.handleSectionUpdate(idx - 1)
      });
    });
  }

  render() {
    const { currentSection } = this.state;
    return (
      <div className="App">
        <div className="narrative-sections">
          <SectionHero
            rootClassName="section-hero"
            onSectionUpdate={this.handleSectionUpdate}
          />
          <Section1
            rootClassName="section-1"
            onSectionUpdate={this.handleSectionUpdate}
          />
          <Section2
            rootClassName="section-2"
            onSectionUpdate={this.handleSectionUpdate}
          />
          <Section3
            rootClassName="section-3"
            onSectionUpdate={this.handleSectionUpdate}
          />
          <SectionMethods
            rootClassName="section-methods"
            onSectionUpdate={this.handleSectionUpdate}
          />
        </div>

        <World currentSection={currentSection} />
      </div>
    );
  }
}

export default hot(App);
