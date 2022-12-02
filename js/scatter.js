// Load data
let data = d3.csv("data/Shot Averages.csv", d =>{
  d.avg_fg_percent = +d.avg_fg_percent
  d.avg_opp_fg_percent = +d.avg_opp_fg_percent
  d.tot_pts = +d.tot_pts
  d.tot_asts = +d.tot_asts
  return d
}).then(data => {
  data = data.sort((a, b) => a.avg_fg_percent - b.avg_fg_percent);
  draw(data)
})

// Draw scatter plots
function draw(data) {
  // Set up margins
  width = 500;
  height = 500;

  // Define max values
  var max_fg = d3.max(data, function (d) {
    return d.avg_fg_percent
  });
  var max_opp_fg = d3.max(data, function (d) {
    return d.avg_opp_fg_percent
  });
  var max_ast = d3.max(data, function(d){
    return d.tot_asts;
  });
  var max_pts = d3.max(data, function(d){
    return d.tot_pts;
  });

  let padding = 100;

  // Initialize scales for both scatter plots
  let fgScale = d3.scaleLinear().domain([0.43, max_fg]).range([padding, width - padding])
  let oppfgScale = d3.scaleLinear().domain([0.43, max_opp_fg]).range([height - padding, padding])
  let ptScale = d3.scaleLinear().domain([7500, 8600]).range([width-padding, padding])
  let astScale = d3.scaleLinear().domain([1500, max_ast]).range([padding, height-padding])

  // Create SVG drawing area
  svg = d3.select("#scatter1")
    .append("svg")
    .attr("height", height)
    .attr("width", width)

  // Create axes for offense/defense scatterplot
  let xAxis = d3.axisBottom().scale(fgScale).ticks(5)
  let yAxis = d3.axisLeft().scale(oppfgScale).ticks(5)

  // Create group for text and axes for offense/defense scatterplot
  let group = svg.append("g")
    .attr("class", "axes")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)

  svg.append("text")
    .attr("x", 300)
    .attr("y", 440)
    .attr("font-size", "smaller")
    .attr("text-anchor", "end")
    .text("Field Goal Percentage")

  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -1.75 * padding)
    .attr("y", padding - 50)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .attr("font-size", "smaller")
    .text("Opponent Field Goal Percentage")

  svg.append("text")
      .attr("x", 450)
      .attr("y", 50)
      .attr("font-size", "16px")
      .attr("text-anchor", "end")
      .text("Field Goal Percentage Vs. Opponent Field Goal Percentage")

  svg2 = d3.select("#scatter2")
    .append("svg")
    .attr("height", height)
    .attr("width", width)

  // Create axes for points/assists scatter plot
  let xAxis2 = d3.axisBottom().scale(astScale).ticks(5)
  let yAxis2 = d3.axisLeft().scale(ptScale).ticks(5)

  // Create group for text and axes placement for points/assists scatter plot
  let group2 = svg2.append("g")
    .attr("class", "axes")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis2);

  svg2.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis2)

  svg2.append("text")
    .attr("x", 300)
    .attr("y", 450)
    .attr("font-size", "smaller")
    .attr("text-anchor", "end")
    .text("Total Assists")

  svg2.append("text")
    .attr("text-anchor", "end")
    .attr("x", -2 * padding)
    .attr("y", padding - 50)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .attr("font-size", "smaller")
    .text("Total Points")

  var tooltip = d3.select("#scatter1")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

  var tooltip2 = d3.select("#scatter2")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function(d) {
    tooltip
        .transition()
        .duration(500)
        .style("opacity", 1)
  }

  var mouseover2 = function(d) {
    tooltip2
        .transition()
        .duration(500)
        .style("opacity", 1)
  }

  var fg_mousemove = function(event, d) {
    tooltip
        .html("Team: " + d.team + "<br>" + "Average Field Goal Percentage: " + d.avg_fg_percent.toFixed(3) + "<br>" + "Average Opponent Field Goal Percentage: " + d.avg_opp_fg_percent.toFixed(3))
    // .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    // .style("top", (d3.mouse(this)[1]) + "px")
  }

  var ast_mousemove = function(event, d) {
    tooltip2
        .html("Team: " + d.team + "<br>" + "Total Points: " + d.tot_pts.toFixed(3) + "<br>" + "Total Assists: " + d.tot_asts.toFixed(3) + "<br>" + "Total Assists to Points Ratio: " + (d.tot_asts/d.tot_pts))
    // .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    // .style("top", (d3.mouse(this)[1]) + "px")
  }
  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip
        .transition()
        .duration(500)
        .style("opacity", 0)
  }

  var mouseleave2 = function(d) {
    tooltip2
        .transition()
        .duration(500)
        .style("opacity", 0)
  }

  // Draw circles for both scatter plots
  let circles = svg.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("id", "circleCustomTooltip")
      .attr("cx", function (d) {
        return fgScale(d.avg_fg_percent)
      })
      .attr("cy", function (d) {
        return oppfgScale(d.avg_opp_fg_percent)
      })
      .attr("r", 4)
      .attr("fill", "red")
      .attr("stroke", "black")
      .attr("fill-opacity", 0.5)
      .on("click", mouseover)
      .on("mousemove", fg_mousemove)
      .on("mouseleave", mouseleave)

  let circles2 = svg2.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("id", "circleCustomTooltip")
      .attr("cx", function (d) {
        return astScale(d.tot_asts)
      })
      .attr("cy", function (d) {
        return ptScale(d.tot_pts)
      })
      .attr("r", 4)
      .attr("fill", "red")
      .attr("stroke", "black")
      .attr("fill-opacity", 0.5)
      .on("click", mouseover2)
      .on("mousemove", ast_mousemove)
      .on("mouseleave", mouseleave2)
}