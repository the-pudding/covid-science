import React from 'react';

const BigNumber = (props) => {
  return (
    <div>
      <div className="value">{props.value}</div>
      <div className="units">{props.units}</div>
    </div>
  );
};

export default BigNumber;
