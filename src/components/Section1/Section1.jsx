import React, { useState, useEffect, Component } from 'react';
import PapersPerYear from './PapersPerYear.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

import ArticleStat from './ArticleStat';
import ArticleGenerator from './ArticleGenerator';

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
      duration: 1,
      delay: 0.5,
      text: 'then 2020 happened...',
      scrollTrigger: {
        trigger: '.section1-scroll-container',
        name: 'revealed-text',
        start: '5% top',
        onToggle: this.handleScrollTrigger,
        // markers: {
        //   startColor: 'white',
        //   endColor: 'black'
        // },
        toggleActions: 'play reset reset reset' // onEnter, onLeave, onEnterBack, onLeaveBack,
      }
    });
    gsap.fromTo(
      '.text-2',
      {
        opacity: 0
      },
      {
        duration: 1,
        delay: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: '.section1-scroll-container',
          name: 'revealed-text',
          start: '10% top',
          toggleActions: 'play complete reverse reset' // onEnter, onLeave, onEnterBack, onLeaveBack,
        }
      }
    );
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
      <div className={this.props.rootClassName}>
        <div className="narrative-text">
          <p>
            <mark>On Jan 1st 2020</mark>, a novel virus was beginning to reveal
            itself to an unprepared world. The next 12 months brought 80+
            million cases, but also the first clinically approved vaccines,
            developed in record-setting time, and whose efficacy exceeded even
            the most optimistic projections. That type of achievement doesn't
            happen in a vacuum.
          </p>

          <p>
            Amidst the crumminess of 2020, a hive of scientists and medical
            researchers mobilized in an historic way. For a year filled with so
            many terrible, horrible, no good, very bad things, the dedicated
            effort of the international science community to understand and get
            us out of the pandemic is something worth celebrating. Hundreds of
            thousands of individuals, spread across thousands of institutions,
            in nearly every country around the world, worked together to
            deconstruct the virus, to learn how it attacks the body and how it
            spreads, and to engineer solutions for how to fight it. And while
            the major breakthroughs made headlines, much of the work that they
            relied on occurred behind the scenes, unacknowledged.
          </p>

          <p>
            One way to grasp the scale of that effort is to look at 2020 through
            the lens of published research articles, one of the primary ways
            scientists and researchers can formally communicate new insights to
            one another. A typical research article might reflect months of data
            collection and analysis from a team of scientists, summarized in a
            set of statistical results and a discussion about how those results
            add to (or challenge) current understanding on a topic. {'  '}
            <a href="https://www.ncbi.nlm.nih.gov/pmc/" target="_blank">
              PubMed Central (PMC)
            </a>{' '}
            is an online repository housing millions of such biomedical and life
            sciences research articles. By searching this database, you can get
            a sense of the breadth of existing research on any given topic.
          </p>

          <p>
            COVID-19, or rather the virus SARS-CoV-2, belongs to a larger class
            of viruses known as coronaviruses (<mark>COVID-19</mark>:{' '}
            <mark>CO</mark>rona<mark>VI</mark>rus <mark>D</mark>isease 20
            <mark>19</mark>) that were first characterized in the mid-1960's.
            However, it wasn't until the SARS outbreak in 2002, and subsequent
            MERS outbreak of 2012, that coronaviruses became the focus of
            increasing research attention.
          </p>
        </div>
        <div className="section1-scroll-container">
          <div className="content-container">
            <div className="plot-container" ref={this.containerRef}>
              {' '}
            </div>

            <div className="text-overlay-container">
              <div className="plot-text">
                By 2019, there were ~5000 publications on coronaviruses coming
                out per year.
              </div>
              <div id="revealed-text"></div>
              <div className="plot-text text-2">
                There were ~80,000 coronavirus-related articles added to PMC in
                2020, a <mark>1600%</mark> increase over 2019.
              </div>
            </div>
          </div>
        </div>

        <div className="narrative-text middle-section">
          <div className="mobile-text">
            There were ~80,000 coronavirus-related articles added to PMC in
            2020, a <mark>1600%</mark> increase over 2019.
          </div>
          <p>
            Of all the articles added in 2020, across all science and medical
            fields, approximately <mark>1 out of every 10</mark> was related to
            coronaviruses (compare that to 2019, where that rate was closer to 1
            out of every 130 articles.)
          </p>
        </div>
        <div className="article-generators-container">
          <ArticleGenerator year="2019" covidRate={0.007} />
          <ArticleGenerator year="2020" covidRate={0.1} />
        </div>

        <div className="narrative-text middle-section">
          <p>
            By expanding the search to include terms specific to the current
            pandemic (like "COVID-19"), the set of research articles grows to
            93,593 new articles in 2020. That means, on average, there were{' '}
            <mark>~11 new articles coming out each hour</mark>, every hour
            throughout the year. Those articles...
          </p>
        </div>

        <div className="stats-container">
          <ArticleStat
            align="left"
            title="were published in"
            value="6799"
            units="different journals"
          />
          <ArticleStat
            align="center"
            title="had authors from"
            value="203"
            units="countries"
          />
          <ArticleStat
            align="right"
            title="had an average of"
            value="5.46"
            units="authors/article"
          />
        </div>
      </div>
    );
  }
}
