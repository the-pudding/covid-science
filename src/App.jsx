import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import World from './components/World';
import SectionHero from './components/SectionHero';
import Section1 from './components/Section1';
import Section2 from './components/Section2';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import './style.scss';

// default scroll trigger
ScrollTrigger.defaults({
  markers: true
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSection: 'section-hero',
      sections: ['section-hero', 'section-1', 'section-2']
    };
  }

  handleSectionUpdate = (sectionIdx) => {
    const { sections } = this.state;
    this.setState({ currentSection: sections[sectionIdx] });
  };

  componentDidMount() {
    const { sections } = this.state;
    sections.map((section, idx) => {
      ScrollTrigger.create({
        trigger: `.${section}`, // trigger on class named `section`
        start: 'top 66%',
        onEnter: () => this.handleSectionUpdate(idx),
        onLeaveBack: () => this.handleSectionUpdate(idx - 1),
        //onUpdate: (self) => console.log(section, self.progress.toFixed(3)),
        //id: section,
        toggleClass: 'active'
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
        </div>

        <World currentSection={currentSection} />
      </div>
    );
  }
}

export default hot(App);
