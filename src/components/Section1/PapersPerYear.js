import * as d3 from 'd3';

export default class PapersPerYearPlot {
  constructor(container) {
    this.container = container;
    this.containerRect = container.getBoundingClientRect();
    this.height = this.containerRect.height;
    this.width = this.containerRect.width;

    console.log('here');
    this.svg = this.createSVG();
  }

  createSVG() {
    const svg = d3
      .select(this.container)
      .append('svg')
      .attr(
        'viewBox',
        `0,0,${Math.floor(this.width)},${Math.floor(this.height)}`
      );

    svg
      .append('rect')
      .attr('x', this.width / 2)
      .attr('y', this.height / 2)
      .attr('width', 100)
      .attr('height', 100)
      .attr('fill', 'steelblue');

    return svg;
  }
}
