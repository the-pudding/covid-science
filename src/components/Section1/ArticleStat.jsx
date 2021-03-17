import React, { useEffect, useState } from 'react';
import { format } from 'd3-format';

import './ArticleStat.scoped.scss';

import { gsap, Linear } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const displayValue = { val: 0 };

const ArticleStat = (props) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.container',
        start: 'top center',
        toggleActions: 'play complete reset reset'
      }
    });

    tl.to(
      displayValue,
      1,
      {
        val: props.value,
        ease: Linear.easeNone,
        onUpdate: () => {
          if (props.units === 'authors/article') {
            setValue(format('.3s')(displayValue.val));
          } else {
            setValue(Math.round(displayValue.val));
          }
        },
        onComplete: () => {
          setValue(props.value);
        }
      },
      { val: 0 }
    );
  }, []);

  return (
    <div className={`container ${props.align}`}>
      <div className="title">{props.title}</div>
      <div className="value">{value}</div>
      <div className="units">
        <mark>{props.units}</mark>
      </div>
    </div>
  );
};

export default ArticleStat;
