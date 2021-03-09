import React, { useState, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import './GraphNarrative.scoped.scss';

const narrative = {
  state1:
    'State 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  state2:
    'State 2: Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  state3:
    'State 3: Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  state4:
    'State 4: Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? '
};

const GraphNarrative = (props) => {
  const [text, setText] = useState(narrative['state1']);
  useEffect(() => {
    if (Object.keys(narrative).includes(props.visState)) {
      setText(narrative[props.visState]);
    } else {
      console.log(`no corresponding narrative for state: ${props.visState}`);
    }
  }, [props.visState]);

  return (
    <div className="narrative-container">
      <SwitchTransition mode="out-in">
        <CSSTransition
          classNames="fade"
          addEndListener={(node, done) => {
            node.addEventListener('transitionend', done, false);
          }}
          key={text}
        >
          <div className="narrative-text">{text}</div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default GraphNarrative;
