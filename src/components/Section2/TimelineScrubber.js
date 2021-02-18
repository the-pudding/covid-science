import { select, thresholdSturges } from 'd3';
import { axisBottom } from 'd3-axis';
import { scaleLinear, scalePow, scaleTime } from 'd3-scale';
import { timeFormat } from 'd3-time-format';

export default class TimelineScrubber {
  constructor(container) {
    this.container = container;
    this.containerRect = container.getBoundingClientRect();
    this.height = this.containerRect.height;
    this.width = this.containerRect.width;

    this.setupPlot();
  }

  setupPlot() {
    // init the fixed parts of the plot
    this.margin = {
      top: 20,
      bottom: 40,
      left: 20,
      right: 20
    };

    this.svg = select(this.container)
      .append('svg')
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
      .range([36, 10])
      .clamp(true);
    this.fontOpacityScale = new scalePow()
      .exponent(1.25)
      .domain([0, maxDist])
      .range([1, 0.2])
      .clamp(true);

    // --- set up timeline scale. Large scale that will be translated to
    // correct position on scroll; current date always centered
    this.tlScale = new scaleTime()
      .domain([new Date('2019-01-01'), new Date('2022-01-01')])
      .range([0, this.width * 20]);

    // add axes
    this.svg.append('g').call((g) => this.draw_tlAxis(g));

    // call update plot for the first time to init
    this.updatePlot(new Date(['01-01-2020']));
  }

  updatePlot(progress) {
    // move the timeline
    const dateOffset = this.tlScale(progress); // map current date to xoffset
    const scrubberRect = this.svg.node().getBoundingClientRect();
    this.svg
      .select('.tl-axis')
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
  }

  draw_tlAxis(g) {
    g.attr('transform', `translate(0, ${this.height / 2})`)
      .attr('class', 'tl-axis')
      .call(axisBottom(this.tlScale).ticks(36).tickFormat(timeFormat('%b')));
  }
}
