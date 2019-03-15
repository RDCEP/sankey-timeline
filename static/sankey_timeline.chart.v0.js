/**
 * Draw title on chart.
 * @param svg
 */
let draw_title = function draw_title(svg) {

  svg.append('rect')
    .attr('width', WIDTH)
    .attr('height', '2px')
    .attr('class', 'bkgd');
  svg.append('rect')
    .attr('width', WIDTH)
    .attr('height', '1px')
    .attr('y', '2.5em')
    .attr('class', 'bkgd');

  let svg_title = svg.append('text')
    .text('US energy usage in ')
    .attr('text-anchor', 'end')
    .attr('x', ELEC_BOX[0] - 5)
    .attr('y', '1.2em')
    .attr('class', 'title');

  svg_title.append('tspan')
    .text('(Watts per capita)')
    .attr('text-anchor', 'end')
    .attr('x', ELEC_BOX[0] - 7)
    .attr('dy', '1.2em')
    .attr('class', 'unit');

  svg_title.append('tspan')
    .text(DATA[0].year)
    .attr('text-anchor', 'start')
    .attr('x', ELEC_BOX[0])
    .attr('dy', '0em')
    .attr('class', 'year')

};

/**
 * Draw initial input boxes on left side of chart at first timestep
 * @param svg
 * @param totals
 */
let draw_boxes_left = function draw_boxes_left(svg, totals) {
  let top = TOP_Y;
  for (let i = 1; i < FUELS.length; ++i) {
    svg.append('rect')
      .attr('x', LEFT_X)
      .attr('y', top)
      .attr('width', BOX_WIDTH)
      .attr('height', function() {
        if (totals[FUELS[i].fuel] > 0) {
          return totals[FUELS[i].fuel] * SCALE + BLEED;
        }
        return 0;
      })
      .attr('class', 'box fuel '+FUELS[i].fuel);
    svg.append('text')
      .text(FUELS[i].name)
      .attr('x', LEFT_X)
      .attr('y', top - 5)
      .attr('class', 'box label '+FUELS[i].fuel)
      .classed('hidden', function() {
        return totals[FUELS[i].fuel] === 0;
      });
    top += totals[FUELS[i].fuel] * SCALE + LEFT_GAP;
  }
};

/**
 * Draw initial output boxes on right side of chart at first timestep.
 * @param svg
 * @param totals
 * @param boxtops
 */
let draw_boxes_right = function draw_boxes_right(svg, totals, boxtops) {
  BOXES.forEach(function(box) {
    let x = WIDTH - BOX_WIDTH;
    let y = boxtops[box.box];
    if (box.box === 'elec') {
      x = ELEC_BOX[0];
      y = ELEC_BOX[1] - totals.elec * SCALE; }
    svg.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', BOX_WIDTH)
        .attr('height', function() {
          if (totals[box.box] > 0) { return totals[box.box] * SCALE + BLEED; }
          return 0; })
        .attr('class', 'box sector '+box.box);

    svg.append('text')
      .text(function() {
        if (box.box === 'res') { return 'Residential'; }
        return box.name; })
      .attr('x', x)
      .attr('y', y - 5)
      .attr('dy', function() {
        if (box.box === 'res') { return '-1.8em'; }
        return '-.8em'; })
      .attr('class', 'label '+box.box)
      .classed('hidden', function() { return totals[box.box] === 0; })
      .classed('fuel', function() { return box.box === 'elec'; })
      .append('tspan')
      .text(function() { if (box.box === 'res') { return '/Commercial'; } })
      .attr('x', x)
      .attr('dy', function() {
        if (box.box === 'res') { return '1em'; }
        return 0; })
      /**
       * Add numeric totals to output boxes
       */
      .append('tspan')
      .attr('class', 'total sector '+box.box)
      .attr('data-sector', box.box)
      .text(sigfig2(totals[box.box]))
      .attr('x', x)
      .attr('dy', '1.2em');
  });
};

/**
 * Parse x- and y-coords into <svg> line using d3.js
 * @param obj
 * @returns {*[]}
 */
const parse_line = function(obj) {
  return [obj.a, obj.b, obj.c, obj.d];
};

/**
 * Draw <svg> line using d3.js
 */
const line = d3.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; });