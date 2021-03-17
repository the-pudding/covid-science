import { interval, select, thresholdSturges } from 'd3';
import { axisBottom, axisTop } from 'd3-axis';
import { scaleLinear, scalePow, scaleTime } from 'd3-scale';
import { timeFormat } from 'd3-time-format';
import { timeMonth, timeDay, timeWeek } from 'd3-time';

import _exports from '../../styles/_exports.module.scss';

const formatMonth = timeFormat('%b');
const formatDay = timeFormat('%d');

export default class TimelineScrubber {
  constructor(container, intervalWin) {
    this.container = container;
    this.containerRect = container.getBoundingClientRect();
    this.height = this.containerRect.height;
    this.width = this.containerRect.width;
    this.intervalWin = intervalWin; // interval window in days

    this.setupPlot();
  }

  setupPlot() {
    // init the fixed parts of the plot
    this.svg = select(this.container)
      .append('svg')
      .attr('class', 'timeline-scrubber-svg')
      .attr(
        'viewBox',
        `0,0,${Math.floor(this.width)},${Math.floor(this.height)}`
      );

    // plot group
    this.plotG = this.svg.append('g');

    // font scales
    const maxDist = Math.min(this.width * 0.2, 200);
    this.fontSizeScale = new scalePow()
      .exponent(1.25)
      .domain([0, maxDist])
      .range([16, 12])
      .clamp(true);
    this.fontOpacityScale = new scalePow()
      .exponent(1.25)
      .domain([0, maxDist])
      .range([0.9, 0.2])
      .clamp(true);

    // --- set up timeline scale. Large scale that will be translated to
    // correct position on scroll; current date always centered
    this.tlScale = new scaleTime()
      .domain([new Date('2019-01-01'), new Date('2022-01-01')])
      .range([0, this.width * 20]);

    // add interval window
    this.svg.append('g').call((g) => this.draw_intervalWindow(g));

    // add axes
    this.svg.append('g').call((g) => this.draw_tlAxis_major(g));
    this.svg.append('g').call((g) => this.draw_tlAxis_minor(g));
    this.svg
      .select('.tl-axis')
      .selectAll('text')
      .each((d, i, nodes) => {
        let currentText = nodes[i].innerHTML;
        select(nodes[i]).html(currentText.toUpperCase());
      });

    // call update plot for the first time to init
    this.updatePlot(new Date(['01-01-2020']));
  }

  updatePlot(currentDate) {
    // move the timeline
    const dateOffset = this.tlScale(currentDate); // map current date to xoffset
    const scrubberRect = this.svg.node().getBoundingClientRect();
    this.svg
      .selectAll('.tl-axis')
      .attr(
        'transform',
        `translate(${window.innerWidth / 2 - dateOffset - scrubberRect.x}, ${
          this.height / 2
        })`
      );

    // update font size/opacity
    this.svg.selectAll('.tl-axis .tick').each((d, i, nodes) => {
      const bbox = nodes[i].getBoundingClientRect();
      const midpoint = bbox.x + bbox.width / 2;
      const distFromCenter = Math.abs(midpoint - window.innerWidth / 2);
      select(nodes[i])
        .select('text')
        .attr('font-size', `${this.fontSizeScale(distFromCenter)}px`)
        .attr('opacity', `${this.fontOpacityScale(distFromCenter)}`);
    });

    // update current date label
    this.svg
      .select('.current-date-label')
      .text(
        `${formatMonth(currentDate).toUpperCase()}\n${formatDay(currentDate)}`
      );
  }

  draw_intervalWindow(g) {
    const intervalWidth =
      this.tlScale(new Date(`2020-01-${this.intervalWin + 1}`)) -
      this.tlScale(new Date('2020-01-01'));
    const intervalHeight = 20;

    g.attr('class', 'interval-window-group').attr(
      'transform',
      `translate(${this.width / 2 - intervalWidth / 2}, ${this.height / 2})`
    );
    g.append('path')
      .attr(
        'd',
        `M 0 0 L ${intervalWidth} 0 L ${
          intervalWidth / 2
        } ${intervalHeight} L 0 0`
      )
      .attr('height', 20)
      .style('fill', _exports.accent1)
      .style('opacity', 1);
    g.append('line')
      .attr('x1', intervalWidth / 2)
      .attr('y1', 0)
      .attr('x2', intervalWidth / 2)
      .attr('y2', 30)
      .attr('stroke', _exports.textColor)
      .attr('stroke-width', 1.5);
    g.append('text')
      .attr('class', 'current-date-label')
      .attr('x', intervalWidth / 2)
      .attr('y', intervalHeight + 20)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'hanging');
    g.append('text')
      .attr('class', 'year-label')
      .attr('x', intervalWidth / 2)
      .attr('y', intervalHeight + 47)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'baseline')
      .text('2020');
  }

  draw_tlAxis_major(g) {
    g.attr('transform', `translate(0, ${this.height / 2})`)
      .attr('class', 'tl-axis')
      .call(
        axisTop(this.tlScale)
          .ticks(timeWeek.every(2))
          .tickFormat(timeFormat('%b %d'))
      );
  }

  draw_tlAxis_minor(g) {
    g.attr('transform', `translate(0, ${this.height / 2})`)
      .attr('class', 'tl-axis')
      .call(
        axisBottom(this.tlScale)
          .ticks(timeDay.every(2))
          .tickFormat(timeFormat(''))
      );
  }
}
