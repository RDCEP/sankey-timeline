(function() {
  'use strict';

  // Reusable counter
  let i = 0;
  let j = 0;
  const k = 0;
  
  const svg = d3.select('.sankey')
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

  // Add layers for fuels
  for (let i = 0; i < FUELS.length; ++i) {
    svg.append('g')
      .attr('class', 'fuel '+FUELS[i].fuel);
  }
  svg.append('g').attr('class', 'fuel elec');

  // const N = 1;
  // DATA = DATA.slice(N, N+2);

  // Sort data chronologically
  DATA.sort(function(a, b) {
    return a.year - b.year;
  });

  // Summary information
  let summary = get_summary();

  // Build graph object with xy-coords for nodes
  let graphs = build_all_graphs(summary);

  // Draw contents of graph object
  // Loop through fuel objects in graph object
  for (i = 0; i < graphs[k].graph.length; ++i) {
    // Loop through boxes
    // Suppress paths without nodes FIXME: this is only for testing
    if (graphs[k].graph[i].b.x === null) {
      continue;
    }
    // Set line styles
    svg.select('.fuel.'+graphs[k].graph[i].fuel)
      .append('path')
      .attr('d', line(parse_line(graphs[k].graph[i])))
      .attr('stroke-width', graphs[k].graph[i].stroke)
      .attr('class', 'flow '+graphs[k].graph[i].fuel+' '+graphs[k].graph[i].box)
  }

  draw_boxes_left(svg, graphs[k].totals);
  draw_boxes_right(svg, graphs[k].totals, summary.box_tops);

  build_animation(graphs, summary);
})();