import React from 'react';
import './BigNumber.scoped.scss';

const BigNumber = (props) => {
  return (
    <div className={`container ${props.align}`}>
      <div className="value">{props.value.toLocaleString()}</div>
      <div className="units">
        <mark>{props.units}</mark>
      </div>
    </div>
  );
};

export default BigNumber;
