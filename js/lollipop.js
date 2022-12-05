// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 100},
    width = 460 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Load data
let win = d3.csv("data/Playoff Count.csv", d =>{
    d.playoffs_made = d.playoffs_made
    return d
}).then(data => {
    data = data.sort((a, b) => b.playoffs_made - a.playoffs_made)
    poDraw(data)
})

function poDraw(data){

    var tooltip = d3.select("#toolpop")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2.5px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    var mouseover = function (d) {
        tooltip
            .transition()
            .duration(500)
            .style("opacity", 1)
    }

    var po_mousemove = function (event, d) {
        tooltip
            .html("TEAM: " + d.team.toUpperCase() + "<br>" + "TOTAL PLAYOFF APPEARANCES: " + d.playoffs_made + "<br>")
    }

    // A function that changes this tooltip when cursor leaves; set opacity to 0 again
    var mouseleave = function (d) {
        tooltip
            .transition()
            .duration(500)
            .style("opacity", 0)

    }
    // append the svg object to the body of the page
    let po_svg = d3.select("#lollipop")
        .append("svg")
        .attr("width", width+margin.left+margin.right)
        .attr("height", height+margin.top+margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
        .domain([0, 20])
        .range([0, width])
    po_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style('color', 'black')
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0) rotate(-45)")
        .style("text-anchor", "end");

// Y axis
    var y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(function(d) { return d.abbr; }))
        .padding(1);

    po_svg.append("g")
        .style('color', 'black')
        .call(d3.axisLeft(y))

// Lines
    po_svg.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", function(d) { return y(d.abbr); })
        .attr("y2", function(d) { return y(d.abbr); })
        .attr("fill", "black")
        .attr("stroke", "black")

// Circles
    po_svg.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",x(0))
        .attr("cy", function(d) { return y(d.abbr); })
        .attr("r", "5")
        .style("fill", "black")
        .attr("stroke", "white")
        .attr("opacity", 1)
        .on("click", mouseover)
        .on("mousemove", po_mousemove)
        .on("mouseleave", mouseleave)

// Change the X coordinates of line and circle
    po_svg.selectAll("circle")
        .transition()
        .duration(2000)
        .attr("cx", function(d) { return x(d.playoffs_made); })

    po_svg.selectAll("line")
        .transition()
        .duration(2000)
        .attr("x1", function(d) { return x(d.playoffs_made); })
}