// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data/data.csv")
  .then(function(Data) {

    // Parse Data/Cast as numbers
    Data.forEach(function(data) {
      data.smokes = +data.smokes;
      data.age = +data.age;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([30, d3.max(Data, d => d.age)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([8, d3.max(Data, d => d.smokes)])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".3");

    var text = chartGroup.selectAll("text")
    .data(Data)
    .enter()
    .append("text");

    var textLabels = text
    .attr("x", d => xLinearScale(d.age))
    .attr("y", d => yLinearScale(d.smokes)+4)
    .text(d => d.abbr)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "white")
    .attr("text-anchor","middle");

    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Avg Age: ${d.age}<br>Smokes (%): ${d.smokes}`);
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokes (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Avg Age");
  });