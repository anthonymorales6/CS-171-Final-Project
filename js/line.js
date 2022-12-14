// Set up conventions
var height = 400;
var width = 400;
var margin = ({top: 50, right: 50, bottom: 50, left:50});
var padding = 100;

var formatTime = d3.timeFormat("%Y");
var parseTime = d3.timeParse(formatTime);

let twoptpct = d3.csv("data/Short List Team Totals 2.csv", d => {
    d.season = parseTime(d.season)
    d.x2p_percent = +d.x2p_percent
    return d
}).then(data => {
    console.log(data)
    lineDraw(data)
})

function lineDraw(data) {

    // begin displaying data at default selected season

    let svg = d3.select("#line1")
        .append("svg")
        .attr("height", height)
        .attr("width", width)

    let min_season = d3.min(data, function (d) {
        return d.season
    })
    let max_season = d3.max(data, function (d) {
        return d.season
    })
    let max_x2p_percent = d3.max(data, function (d) {
        return d.x2p_percent
    })

    // Create xScale for seasons
    let xScale = d3.scaleTime()
        .domain([min_season, max_season])
        .range([padding, width - padding])

    // Create yScale for 2-point percentages
    let yScale = d3.scaleLinear()
        .domain([0.45, max_x2p_percent])
        .range([height - padding, padding])

    // Create xAxis using xScale
    let xAxis = d3.axisBottom().scale(xScale).tickFormat(formatTime)

    // Create yAxis using yScale
    let yAxis = d3.axisLeft().scale(yScale).ticks(5)

    let group = svg.append("g")
        .attr("class", "axes")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .style('color', 'black')
        .call(xAxis)
        .selectAll("text")
        .attr("x", 25)
        .attr("y", -3.5)
        .attr("transform", "rotate(45)")

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + padding + ",0)")
        .style('color', 'black')
        .call(yAxis)

    svg.append("text")
        .attr("x", 220)
        .attr("y", 360)
        .attr("font-size", "big")
        .attr("text-anchor", "end")
        .text("Year")

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -1.25 * padding)
        .attr("y", padding - 70)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .attr("font-size", "big")
        .text("2-point percentage")

    // Path for line graph
    let pathSelect = svg
        .selectAll()
        .data(data)
        .enter();

    let line = d3.line()
        .curve(d3.curveBasis)
        .x(d => xScale(d.season))
        .y(d => yScale(d.x2p_percent))

    // let line2 = svg.selectAll(".line")
    //     .data(data2)
    //     .enter()
    //     .append('path')
    //         .attr("d", function(d){
    //             // console.log(d)
    //                 .x(d => xScale(d.season))
    //                 .y(d => yScale(d.x2p_percent))
    //                 .curve(d3.curveBasis)
    //         })
    //         .attr('class', 'line')
    //         .style("fill", "none")
    //         .attr('stroke-width', "2px")
    //         .style("opacity", 0.05)
    //         .attr("stroke", function (d) {
    //             // console.log(d)
    //             return 'black'
    //         });

    pathSelect
        .append('path')
        .datum(data)
        .attr('class', 'line')
        .attr("d", line(data))
        .style("fill", "none")
        .attr('stroke-width', "2px")
        .style("opacity", 0.05)
        .attr("stroke", function (d) {
            return 'black'
        });
    }

