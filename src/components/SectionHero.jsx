import React from 'react';
import './SectionHero.scss';

const SectionHero = (props) => {
  return (
    <section className={props.rootClassName}>
      <h1>Section Hero</h1>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
        praesentium, deleniti voluptatum quis laborum ea enim assumenda error
        natus iusto magnam harum veritatis officiis asperiores. Quia,
        praesentium! Maxime, quia! Saepe!
      </div>
    </section>
  );
};

export default SectionHero;
