const build_animation = function build_animation(graphs, graph_nest, summary, svg) {
  let i = 1;
  let years = Object.keys(graph_nest.strokes).sort().map(Number);
  console.log(years);

  function animate_period() {

    let n = years[i] - years[i-1];
    let duration = n * SPEED;

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
      .duration(duration)
      .ease(d3.easeLinear)
      .on('start', function() {
        let d = d3.select(this);
        d3.active(this)
          /*
           Update flows' geometry
           */
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
          /*
           Update flows' stroke width
           */
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
            /*
             Update fuel box y-coordinate
             */
            if (d.classed('box') && d.classed('fuel')) {
              return graph_nest.tops[years[i]][d.attr('data-fuel')];
            }
            /*
             Update fuel box label y-coordinate
             */
            else if (d.classed('label') && d.classed('fuel')) {
              return graph_nest.tops[years[i]][d.attr('data-fuel')] - 5;
            }
            return d.attr('y');
          })
          .attr('height', function() {
            /*
             Update sector box height
             */
            if (d.classed('box') && d.classed('sector')) {
              return graph_nest.heights[years[i]][d.attr('data-sector')];
            }
            return d.attr('height');
          })
          .tween('text', function() {
            let that = this;
            /*
             Update year
             */
            if (d.classed('year')) {
              let a = parseInt(that.textContent);
              let b = years[i];
              return function(t) {
                let v = a + (b - a) * t;
                that.setAttribute('data-value', v);
                that.textContent = Math.round(v);
              };
            /*
             Update sector total
             */
            } else if (d.classed('total')) {
              let a = parseFloat(that.getAttribute('data-value'));
              let b = graphs[i].totals[that.getAttribute('data-sector')];
              return function(t) {
                let v = a + (b - a) * t;
                that.setAttribute('data-value', v);
                that.textContent = sigfig2(v);
              };
            }

          });
      });

    i++;

    if (i < graphs.length - 1) {
      setTimeout(animate_period, duration);
    }

  }

  animate_period();

};