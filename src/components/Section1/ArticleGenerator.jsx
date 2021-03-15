import React, { useState, useEffect } from 'react';
import Sketch from 'react-p5';
import { scalePow } from 'd3-scale';
import { min } from 'd3-array';
import { Utils } from '../../js/Utils.js';
import _exports from '../../styles/_exports.module.scss';

import './ArticleGenerator.scoped.scss';

const w = 300;
const h = 200;

const ArticleGenerator = (props) => {
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    let newColumns = [];
    let x = 2;
    let colWidth = 10;
    while (x < w) {
      newColumns.push(
        new Column(x, Utils.randBw(0.5, 1.5), colWidth, props.covidRate)
      );
      x += colWidth + 5;
    }
    setColumns(newColumns);
  }, []);

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(w, h).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.clear();
    p5.background(255, 130, 20, 0);

    // draw start line
    // p5.fill('#ffffff');
    // p5.noStroke();
    // p5.rect(0, 0, w, 3);

    // update all columns
    for (let col of columns) {
      col.update(p5);
    }
  };

  return (
    <div className="article-generator-container">
      <div className="title">
        Rate of <span>coronavirus</span> articles in <mark>{props.year}</mark>
      </div>
      <Sketch setup={setup} draw={draw} />
    </div>
  );
};

export default ArticleGenerator;

// --- Pills
class Column {
  // class to keep track of all of the pills in a given column
  constructor(x, stepSize, pillWidth, covidRate) {
    this.stepSize = stepSize;
    this.x = x;
    this.pillWidth = pillWidth;
    this.covidRate = covidRate;

    // set up alpha scale for this column
    this.alphaScale = scalePow()
      .domain([0, Utils.randBw(0.5 * h, 0.9 * h)])
      .range([255, 0])
      .exponent(2)
      .clamp(true);

    // init with first pill
    this.pills = [];
    this.pills.push(
      new Article(x, stepSize, pillWidth, this.alphaScale, covidRate)
    );
  }

  update(p5) {
    // update and display each article pill
    this.pills.forEach((pill) => {
      pill.update();
      pill.display(p5);
    });

    // figure out if we need to add a new pill
    const minDistFromStart = min(this.pills.map((pill) => pill.y));
    if (minDistFromStart > 5) {
      this.pills.push(
        new Article(
          this.x,
          this.stepSize,
          this.pillWidth,
          this.alphaScale,
          this.covidRate
        )
      );
    }

    // remove dead article pills
    this.pills = this.pills.filter((pill) => pill.isAlive);
  }
}

class Article {
  constructor(x, stepSize, pillWidth, alphaScale, covidRate) {
    this.x = x;
    this.stepSize = stepSize;
    this.w = pillWidth;
    this.alphaScale = alphaScale;
    this.isCovidArticle = Math.random() <= covidRate;
    this.h = 20;
    this.cornerR = 3;
    this.y = -this.h;
    this.isAlive = true;
    this.alpha = 1;
    this.baseColor = this.isCovidArticle ? _exports.accent1 : '#ffffff00';
  }

  update() {
    // update position
    this.y += this.stepSize;
    // update life
    if (this.y > h) {
      this.isAlive = false;
    }
  }

  display(p5) {
    // update alpha
    this.alpha = this.alphaScale(this.y);
    this.color = p5.color(this.baseColor);
    if (this.isCovidArticle) {
      this.color.setAlpha(this.alpha);
    }
    p5.stroke(120, this.alpha);
    p5.fill(this.color);
    p5.rect(this.x, this.y, this.w, this.h, this.cornerR);
  }
}
