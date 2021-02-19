import React from 'react';
import './BigNumber.scoped.scss';

const BigNumber = (props) => {
  return (
    <div className={`container ${props.align}`}>
      <div className="value">{props.value}</div>
      <div className="units">{props.units}</div>
    </div>
  );
};

export default BigNumber;
