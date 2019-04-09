const build_animation = function build_animation(graphs, graph_nest, summary, svg) {
  let i = 1;
  let years = Object.keys(graph_nest.strokes).sort().map(Number);
  let n = years[i] - years[i-1];
  let d = n * SPEED;

  function animate_period() {
    svg.selectAll('.label')
      .classed('hidden', function() {
        let d = d3.select(this);
        if (d.classed('sector')) {
          return graphs[i].totals[d.attr('data-sector')] <= 0;
        } else if (d.classed('fuel')) {
          return graphs[i].totals[d.attr('data-fuel')] <= 0;
        }
      });
    d3.selectAll('.animate')
      .transition()
      .duration(d)
      .ease(d3.easeLinear)
      .on('start', function() {
        let d = d3.select(this);
        d3.active(this)
          .attr('d', function() {
            if (d.classed('flow')) {
              let l = graphs[i].graph.filter(function(e) {
                return e.fuel === d.attr('data-fuel')})
                .filter(function(e) {
                  return e.box === d.attr('data-sector')
                })[0];
              return line(parse_line(l));
            }
          })
          .attr('stroke-width', function() {
            if (d.classed('flow')) {
              let s = graph_nest.strokes[years[i]][d.attr('data-fuel')][d.attr('data-sector')];
              if (s > 0) {
                return s + BLEED;
              }
              return 0;
            }
          })
          .attr('y', function() {
            if (d.classed('box') && d.classed('fuel')) {
              return graph_nest.tops[years[i]][d.attr('data-fuel')];
            }
            else if (d.classed('label') && d.classed('fuel')) {
              return graph_nest.tops[years[i]][d.attr('data-fuel')] - 5;
            }
            return d.attr('y');
          })
          .attr('height', function() {
            if (d.classed('box') && d.classed('sector')) {
              return graph_nest.heights[years[i]][d.attr('data-sector')];
            }
            return d.attr('height');
          })
          .tween('text', function() {
            let that = this;
            if (d.classed('year')) {
              let a = parseInt(that.textContent);
              let b = years[i];
              return function(t) {
                let v = a + (b - a) * t;
                that.setAttribute('data-value', v);
                that.textContent = Math.round(v);
              };
            } else if (d.classed('total')) {
              let a = parseFloat(that.getAttribute('data-value'));
              let b = graphs[i].totals[that.getAttribute('data-sector')];
              return function(t) {
                let v = a + (b - a) * t;
                that.setAttribute('data-value', v);
                that.textContent = sigfig2(v);
              };
            }
            // return d.attr('text');

          });
      });

    i++;

    if (i < graphs.length) {
      setTimeout(animate_period, d);
    }

  }

  animate_period();

};