import React, { useState, useEffect } from 'react';
import './SectionMethods.scoped.scss';

const SectionMethods = (props) => {
  return (
    <section className={props.rootClassName}>
      <h1>Methods</h1>
      <div className="methods-container">
        <div className="col">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti
            distinctio animi minus repellat nobis eos veritatis perferendis
            maiores ducimus asperiores? Ea quae eum veniam quos sequi cum
            explicabo temporibus accusantium.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti
            distinctio animi minus repellat nobis eos veritatis perferendis
            maiores ducimus asperiores? Ea quae eum veniam quos sequi cum
            explicabo temporibus accusantium.
          </p>
        </div>
        <div className="col">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti
            distinctio animi minus repellat nobis eos veritatis perferendis
            maiores ducimus asperiores? Ea quae eum veniam quos sequi cum
            explicabo temporibus accusantium.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SectionMethods;
