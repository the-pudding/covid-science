// import * as d3 from 'd3';
import { select, selectAll } from 'd3';
import { scaleLinear, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';
import { axisRight, axisBottom } from 'd3-axis';
import { timeParse } from 'd3-time-format';
import { format } from 'd3-format';
import { easeExpInOut, easeLinear, easePolyOut } from 'd3-ease';
import { annotation } from 'd3-svg-annotation';

import papersDataCSV from './assets/papersPerYear.csv';

export default class PapersPerYearPlot {
  constructor(container, show2020) {
    this.container = container; // ref to parent div
    this.show2020 = show2020;

    // parse data
    this.yearParser = timeParse('%Y');
    this.data = papersDataCSV.slice(1).map((d) => {
      return {
        year: this.yearParser(d[0]),
        nPapers: +d[1]
      };
    });

    this.containerRect = container.getBoundingClientRect();
    this.height = this.containerRect.height;
    this.width = this.containerRect.width;
    this.color = 'tomato';

    this.setupPlot();
  }

  setupPlot() {
    // init the fixed parts of the plot
    this.margin = {
      top: 20,
      bottom: 70,
      left: 20,
      right: 70
    };

    this.svg = select(this.container)
      .append('svg')
      .attr('class', 'papers-per-year-plot')
      .attr(
        'viewBox',
        `0,0,${Math.floor(this.width)},${Math.floor(this.height)}`
      );

    // plot group
    this.plotG = this.svg.append('g');

    // scales
    this.yScale = scaleLinear()
      .domain([0, 10000])
      .range([this.height - this.margin.bottom, this.margin.top]);
    this.xScale = scaleTime()
      .domain(extent(this.data, (d) => d.year))
      .range([this.margin.left, this.width - this.margin.right]);
    this.barWidth =
      ((this.xScale.range()[1] - this.xScale.range()[0]) / this.data.length) *
      0.9;

    // axes
    this.svg.append('g').call((g) => this.draw_xAxis(g));
    this.svg.append('g').call((g) => this.draw_yAxis(g));

    // annotations
    this.outbreakAnnots = [
      {
        note: {
          label: 'SARS outbreak',
          align: 'right'
        },
        connector: {
          end: 'dot'
        },
        color: 'grey',
        x: this.xScale(this.yearParser(2002)),
        y: this.yScale(1500),
        dx: -40,
        dy: -30
      },
      {
        note: {
          label: 'MERS outbreak',
          align: 'right'
        },
        connector: {
          end: 'dot'
        },
        color: 'grey',
        x: this.xScale(this.yearParser(2012)),
        y: this.yScale(5000),
        dx: -50,
        dy: -20
      }
    ];
    this.svg
      .append('g')
      .attr('class', 'annotation-group')
      .call(annotation().annotations(this.outbreakAnnots));

    // title
    this.svg
      .append('g')
      .attr('class', 'title-group')
      .append('text')
      .attr('text-anchor', 'end')
      .attr('x', this.xScale(this.yearParser(2019)) + 10)
      .attr('y', this.yScale(0) + 50)
      .text('Number of "coronavirus" publications by year');

    // call update plot to init the first draw of everything
    this.updatePlot(false);
  }

  updatePlot(show2020) {
    // parent component will call this function to toggle 2020 data on and off
    this.show2020 = show2020;

    if (this.show2020) {
      // update yScale
      this.yScale.domain([0, 100000]); // set upper lim to 100k
      this.yAxis_xPos = this.width - this.margin.right + this.barWidth;

      // hide annotations
      this.svg
        .select('.annotation-group')
        .transition()
        .duration(250)
        .attr('opacity', 0);

      // show 2020 xtick, minimize other years
      this.svg
        .select('.x.axis')
        .call((g) =>
          g
            .select('.tick:last-of-type text')
            .transition()
            .duration(this.duration)
            .attr('opacity', 1)
        )
        .call((g) =>
          g.selectAll('.tick:not(:last-of-type)').classed('minimized', true)
        );

      // animate the 90k ytick upwards and fade in
      this.svg
        .select('.yTickLabelIdx-2')
        .attr('transform', `translate(0, ${this.yScale(5000)})`)
        .attr('opacity', 0)
        .transition()
        .duration(this.duration)
        .attr('transform', `translate(0, ${this.yScale(90000)})`)
        .attr('opacity', 1);

      // hide 0 ytick
      this.svg
        .select('.yTickLabelIdx-0')
        .attr('opacity', 1)
        .transition()
        .duration(this.duration)
        .attr('opacity', 0);
    } else {
      this.yScale.domain([0, 6000]); // set upper lim to 6k
      this.yAxis_xPos = this.width - this.margin.right;

      // show annotations
      this.svg
        .select('.annotation-group')
        .attr('opacity', 0)
        .transition()
        .duration(this.duration)
        .attr('opacity', 1);

      // hide 2020 x tick
      this.svg
        .select('.x.axis')
        .call((g) => g.select('.tick:last-of-type text').attr('opacity', 0))
        .call((g) =>
          g.selectAll('.tick:not(:last-of-type)').classed('minimized', false)
        );

      // fade the 90k ytick label out
      this.svg
        .select('.yTickLabelIdx-2')
        .transition()
        .duration(500)
        .attr('opacity', 0);

      // show 0 ytick
      this.svg
        .select('.yTickLabelIdx-0')
        .attr('opacity', 0)
        .transition()
        .duration(this.duration)
        .attr('opacity', 1);
    }

    this.drawPlot();
  }

  drawPlot() {
    // filter data based on whether to show 2020 or not
    const plotData = this.show2020 ? this.data : this.data.slice(0, -1);

    // init transition
    this.duration = 1000;
    this.delay = 250;
    const t = this.svg
      .transition()
      .duration(this.duration)
      .ease(easePolyOut.exponent(3));

    // update axes
    this.svg
      .select('.yTickLabelIdx-1') // move 5K tick
      .transition(t)
      .delay(this.delay)
      .attr('transform', `translate(0, ${this.yScale(5000)})`);

    this.svg
      .select('.y.axis')
      .transition(t)
      .attr('transform', `translate(${this.yAxis_xPos}, 0)`);

    // draw all rects for current data
    this.plotG
      .selectAll('rect')
      .data(plotData)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('fill', this.color)
            .attr('x', (d) => this.xScale(d.year) - this.barWidth / 2)
            .attr('y', this.yScale(0))
            .attr('height', 0)
            .attr('width', this.barWidth)
            .call((enter) =>
              enter
                .transition(t)
                .attr('y', (d) => this.yScale(d.nPapers))
                .attr('height', (d) => this.yScale(0) - this.yScale(d.nPapers))
            ),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .delay((d) => (d.year.getFullYear() == 2020 ? 0 : this.delay))
              .attr('y', (d) => this.yScale(d.nPapers))
              .attr('height', (d) => this.yScale(0) - this.yScale(d.nPapers))
          ),
        (exit) =>
          exit.call((exit) =>
            exit
              .transition(t)
              .attr('y', (d) => this.yScale(0))
              .attr('height', 0)
              .remove()
          )
      );
  }

  draw_xAxis(g) {
    g.attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
      .attr('class', 'x axis')
      .call(
        axisBottom(this.xScale)
          .ticks(this.width / 80)
          .tickSizeOuter(0)
      )
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('line').remove())
      .call((g) =>
        g
          .append('text')
          .attr('x', this.width - this.margin.right)
          .attr('y', -4)
          .attr('text-anchor', 'end')
          .text(this.data.year)
      )
      .call((g) =>
        g.attr('opacity', 0).transition().duration(1250).attr('opacity', 1)
      );
  }

  draw_yAxis(g) {
    g.attr('transform', `translate(${this.width - this.margin.right + 10}, 0)`)
      .attr('class', 'y axis')
      .call(
        axisRight(this.yScale)
          .tickValues([0, 5000, 90000])
          .tickFormat(format('.1s'))
      )
      .call((g) =>
        g.selectAll('.tick').attr('class', (d, i) => `yTickLabelIdx-${i}`)
      )
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('line').remove())
      .call((g) =>
        g.attr('opacity', 0).transition().duration(1).attr('opacity', 1)
      );
  }
}
