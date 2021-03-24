import React from 'react';
import './SectionHero.scoped.scss';

const SectionHero = (props) => {
  return (
    <section className={props.rootClassName}>
      <div className="title-container">
        <h1 className="title">Following the Science</h1>
        <div className="subtitle">
          A look at the global research effort to know and defeat COVID-19
        </div>
        <div className="byline">
          By{' '}
          <a href="https://jeffmacinnes.com" target="_blank">
            Jeff MacInnes
          </a>
        </div>
      </div>
    </section>
  );
};

export default SectionHero;
