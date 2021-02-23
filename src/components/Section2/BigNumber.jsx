import React from 'react';
import './BigNumber.scoped.scss';

const formatNumber = (x) => {
  // high-five: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

const BigNumber = (props) => {
  return (
    <div className={`container ${props.align}`}>
      <div className="value">{formatNumber(props.value)}</div>
      <div className="units">{props.units}</div>
    </div>
  );
};

export default BigNumber;
