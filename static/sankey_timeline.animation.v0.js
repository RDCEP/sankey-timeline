const build_animation = function build_animation(graphs, summary) {
  let t = d3.transition()
    .ease(d3.easeLinear);

  for (let i = 1; i < graphs.length; ++i) {
    let n = graphs[i].year - graphs[i-1].year;
    t.duration(n * 500);
    
    graphs[i].graph.forEach(function(g) {
      d3.select('.flow.'+g.fuel+'.'+g.box)
        .transition(t)
        .attr('d', line(parse_line(g)))
        .attr('stroke-width', g.stroke)
    });

    let top = TOP_Y;
    for (let j = 1; j < FUELS.length; ++j) {
      let height = summary.totals[i][FUELS[j].fuel] * SCALE;
      d3.select('.box.'+FUELS[j].fuel)
        .transition(t)
        .attr('y', top)
        .attr('height', height);
      top += height + LEFT_GAP;
    }

    for (let j = 1; j < BOXES.length; ++j) {
      let height = summary.totals[i][BOXES[j].box] * SCALE;
      d3.select('.box.'+BOXES[j].box)
        .transition(t)
        .attr('y', summary.box_tops[BOXES[j].box])
        .attr('height', height);
    }
  }
};