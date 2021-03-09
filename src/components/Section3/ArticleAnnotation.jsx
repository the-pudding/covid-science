import React, { useState, useEffect } from 'react';
import './ArticleAnnotation.scoped.scss';

const ArticleAnnotation = (props) => {
  return (
    <div
      className={`annotation-container ${props.visible && 'visible'} ${
        props.content.vaccine === 'Moderna' && 'baseline-bottom'
      }`}
      style={{ left: props.coords.x, top: props.coords.y }}
    >
      <div className="vaccine">{props.content.vaccine}</div>
      <div className="title">{props.content.title}</div>
      <div className="journal">{props.content.journal}</div>
      <div className="date">{props.content.date}</div>
    </div>
  );
};

export default ArticleAnnotation;
