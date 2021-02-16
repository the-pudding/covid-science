import React from 'react';
import './SectionHero.scss';

const SectionHero = (props) => {
  return (
    <section className={props.rootClassName}>
      <div className="title-container">
        <h1 className="title">
          Section
          <br />
          Hero
        </h1>
        <div className="subtitle">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
          praesentium, deleniti voluptatum quis laborum ea enim assumenda error
          natus iusto magnam harum veritatis officiis asperiores. Quia,
          praesentium! Maxime, quia! Saepe!
        </div>
      </div>
    </section>
  );
};

export default SectionHero;
