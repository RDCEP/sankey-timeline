(function() {
  'use strict';

  let state = false;

  // Sort data chronologically
  DATA.sort(function(a, b) {
    return a.year - b.year;
  });


  let svg = d3.select('.sankey.container')
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

  draw_title(svg);

  // Add layers for fuels
  for (let i = 0; i < FUELS.length; ++i) {
    svg.append('g')
      .attr('class', 'fuel '+FUELS[i].fuel);
  }
  svg.append('g').attr('class', 'fuel elec');

  let graph_nest = {strokes: {}, tops: {}, heights: {}};

  for (let i = 0; i < graphs.length; ++i) {
    let top = TOP_Y;
    let y = graphs[i].year;
    graph_nest.strokes[y] = {};
    graph_nest.tops[y] = {};
    graph_nest.heights[y] = {};
    for (let j = 0; j < FUELS.length; ++j) {
      let f = FUELS[j].fuel;

      graph_nest.strokes[y][f] = {};

      if (f !== 'elec') {
        graph_nest.tops[y][f] = top;
        top += summary.totals[i][f] * SCALE + LEFT_GAP;
      } else {
        graph_nest.tops[y][f] = ELEC_BOX[1] - summary.totals[i].elec * SCALE;
      }

      for (let k = 0; k < BOXES.length; ++k) {
        let b = BOXES[k].box;

        graph_nest.heights[y][b] = summary.totals[i][b] * SCALE;

        let s =
          graphs[i].graph.filter(function(d) {
            return d.fuel === f;
          })
          .filter(function(d) {
            return d.box === b;
          })[0];
        if (!(s === undefined || s === null)) {
          graph_nest.strokes[y][f][b] = s.stroke;
        }
      }
    }
  }

  state = draw_initial_graph(svg);

  // build_animation(graphs, summary, svg); // v0
  build_animation(graphs, graph_nest, summary, svg);  // v1

  console.log(graph_nest);
  // console.log(graphs);
  console.log(summary);

})();