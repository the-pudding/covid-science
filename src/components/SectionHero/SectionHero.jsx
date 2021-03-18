import React from 'react';
import './SectionHero.scoped.scss';

const SectionHero = (props) => {
  return (
    <section className={props.rootClassName}>
      <div className="title-container">
        <h1 className="title">Following the Science</h1>
        <div className="subtitle">
          The unprecedented response of the global science and medical research
          community to the COVID-19 pandemic
        </div>
        <div className="byline">
          By{' '}
          <a href="https://jeffmacinnes.com" target="_blank">
            Jeff MacInnes
          </a>
          ,{' '}
          <a href="http://iliablinderman.com/" target="_blank">
            Ilia Blinderman
          </a>
        </div>
      </div>
    </section>
  );
};

export default SectionHero;
