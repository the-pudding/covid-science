import React, { useState, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import './GraphNarrative.scoped.scss';

const narrative = {
  state1:
    'For instance, in December 2020, both Pfizer and Moderna published articles reporting the success of their phase 3 vaccine clinical trials, officially paving the way for approval and wide scale distribution.',
  state2:
    'Each of these articles cited some of the key prior work supporting the vaccine development and the current phase 3 results (including earlier phase 1 & 2 trials, and non-human animal results).',
  state3:
    'And each of those supporting articles, in turn, cited collections of prior work that made the supporting work possible, including articles on the structural biology of SARS-CoV-2 virus, early candidate mRNA vaccines, and key insights from the previous SARS and MERS outbreaks. ',
  state4:
    'But these previous articles were not only relevant to the development of vaccines. Most of these articles went on to be cited by tens (or hundreds, or thousands) of subsequent articles, and collectively make up just a portion of the web of research surrounding these topics.  '
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