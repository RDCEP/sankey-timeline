(function() {
  'use strict';

  // const k = DATA.length - 10;
  const k = 0;

  let svg = d3.select('.sankey.container')
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

  // Add layers for fuels
  for (let i = 0; i < FUELS.length; ++i) {
    svg.append('g')
      .attr('class', 'fuel '+FUELS[i].fuel);
  }
  svg.append('g').attr('class', 'fuel elec');

  // Sort data chronologically
  DATA.sort(function(a, b) {
    return a.year - b.year;
  });
  // DATA = DATA.slice(-1, );

  // Summary information
  let summary = get_summary();

  // Build graph object with xy-coords for nodes
  let graphs = build_all_graphs(summary);

  // Draw contents of graph object
  // Loop through fuel objects in graph object
  for (let i = 0; i < graphs[k].graph.length; ++i) {
    // Loop through boxes
    // Suppress paths without nodes FIXME: this is only for testing
    if (graphs[k].graph[i].b.x === null) {
      continue;
    }
    // Set line styles
    svg.select('.fuel.'+graphs[k].graph[i].fuel)
      .append('path')
      .attr('d', line(parse_line(graphs[k].graph[i])))
      .attr('stroke-width', function() {
          if (graphs[k].graph[i].stroke > 0) {
            return graphs[k].graph[i].stroke+BLEED;
          }
          return 0;
        })
      .attr('class', 'flow '+graphs[k].graph[i].fuel+' '+graphs[k].graph[i].box)
  }

  draw_boxes_left(svg, graphs[k].totals);
  draw_boxes_right(svg, graphs[k].totals, summary.box_tops);

  svg = d3.select('.title.container')
    .style('width', WIDTH+'px')
    .style('height', 50+'px')
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', 50);



  draw_title(svg);

  build_animation(graphs, summary);

  console.log(graphs);
  // console.log(summary);
  // console.log(build_graphs(summary));

})();