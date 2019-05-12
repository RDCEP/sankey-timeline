# Sankey timeline

JavaScript-based animated Sankey graphs.

## What's in here

* `parse` contains scripts for converting data in 
  Excel files into `json` format.
* `static` 
  * Launch `index.html` to run the animation.
  * `sankey_timeline.animation.*.js` attaches `d3.transition` 
    objects to relevant elements in the DOM. 
  * `sankey_timeline.chart.*.js` draws the elements
    that make up the Sankey diagram (flows, input and
    output boxes, labels, etc.).
  * `sankey_timeline.constants.*.js` contains variables with
    fixed values used throughout the code.
  * `sankey_timeline.data.*.js` contains the data being graphed.
  * `sankey_timeline.funcs.*.js` contains methods used for 
    calculating the geometry of the flows.
  * `sankey_timeline.summary.*.js` calculates summary information
    contained in the data that determines the geometry of the 
    graph.  