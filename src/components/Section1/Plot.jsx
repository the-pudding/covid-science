import React, { useState, useEffect } from 'react';

import './Plot.scss';
import PapersPerYear from './PapersPerYear.js';

const Plot = (props) => {
  const containerRef = React.useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const plot = new PapersPerYear(containerRef.current);
    }
  }, []);

  return <div ref={containerRef} className="plot-container" />;
};

export default Plot;
