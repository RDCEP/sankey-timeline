const build_animation = function build_animation(graphs, summary) {
  let i = 1;

  function animate_period() {
    let n = graphs[i].year - graphs[i-1].year;
    let d = n * SPEED;
    let t = d3.transition()
      .ease(d3.easeLinear)
      .duration(d);

    graphs[i].graph.forEach(function(g) {
      d3.select('.flow.'+g.fuel+'.'+g.box)
        .transition(t)
        .attr('d', line(parse_line(g)))
        .attr('stroke-width', function() {
          if (g.stroke > 0) {
            return g.stroke+BLEED;
          }
          return 0;
        })
    });

    let top = TOP_Y;

    for (let j = 1; j < FUELS.length; ++j) {
      let height = summary.totals[i][FUELS[j].fuel] * SCALE;
      d3.select('.box.'+FUELS[j].fuel)
        .transition(t)
        .attr('y', function() {
          if (summary.totals[i][FUELS[j].fuel] > 0) {
            return top - BLEED / 2;
          }
          return top;
        })
        .attr('height', function() {
          if (summary.totals[i][FUELS[j].fuel] > 0) {
            return height + BLEED;
          }
          return height;
        });

      d3.select('.label.'+FUELS[j].fuel)
        .classed('hidden', function() {
          return summary.totals[i][FUELS[j].fuel] === 0;
        })
        .transition(t)
        .attr('y', top - 5);
      top += height + LEFT_GAP;
    }

    let elec_total = summary.totals[i].elec
    d3.select('.box.elec')
      .transition(t)
      .attr('y', ELEC_BOX[1] - elec_total * SCALE)
      .attr('height', elec_total * SCALE);
    d3.select('.label.elec')
      .classed('hidden', function() {
        return elec_total === 0;
      })
      .transition(t)
      .attr('y', ELEC_BOX[1] - elec_total * SCALE - 5);

    for (let j = 1; j < BOXES.length; ++j) {
      let height = summary.totals[i][BOXES[j].box] * SCALE;
      d3.select('.box.'+BOXES[j].box)
        .transition(t)
        .attr('y', summary.box_tops[BOXES[j].box])
        .attr('height', height);
    }

    d3.select('.title.year')
      .transition(t)
      .tween('text', function() {
        let self = this;
        let a = parseInt(self.textContent);
        let b = graphs[i].year;
        return function(t) {
            self.textContent = Math.round(a + (b - a) * t);
        };
      });

    i++;

    if (i < graphs.length) {
      setTimeout(animate_period, d);
    }

  }

  animate_period();

};