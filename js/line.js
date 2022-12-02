// Set up conventions
let height = 500;
let width = 500;
let margin = ({top: 50, right: 50, bottom: 50, left:50});
let padding = 100;

var formatTime = d3.timeFormat("%Y");
var parseTime = d3.timeParse(formatTime);

let data2 = d3.csv("data/Short List Team Totals 2.csv", d => {
    d.season = parseTime(d.season)
    d.x2p_percent = +d.x2p_percent
    return d
}).then(data2 => {

    let svg = d3.select("#line1")
        .append("svg")
        .attr("height", height)
        .attr("width", width)

    let min_season = d3.min(data2, function (d) {
        return d.season
    })
    let max_season = d3.max(data2, function (d) {
        return d.season
    })
    let max_x2p_percent = d3.max(data2, function (d) {
        return d.x2p_percent
    })

    // Create xScale for seasons
    let xScale = d3.scaleTime()
        .domain([min_season, max_season])
        .range([padding, width - padding])

    // Create yScale for 2-point percentages
    let yScale = d3.scaleLinear()
        .domain([0.43, max_x2p_percent])
        .range([height - padding, padding])

    // Create xAxis using xScale
    let xAxis = d3.axisBottom().scale(xScale).tickFormat(formatTime)

    // Create yAxis using yScale
    let yAxis = d3.axisLeft().scale(yScale).ticks(5)

    let group = svg.append("g")
        .attr("class", "axes")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("x", 25)
        .attr("y", -3.5)
        .attr("transform", "rotate(90)")

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)

    // Path for line graph
    let pathSelect = svg
        .selectAll()
        .data(data2)
        .enter();

    let line = d3.line()
        .curve(d3.curveBasis)
        .x(d => xScale(d.season))
        .y(d => yScale(d.x2p_percent))

    let line2 = svg.selectAll(".line")
        .data(data2)
        .enter()
        .append('path')
            .attr("d", function(d){
                console.log(d)
                    .x(d => xScale(d.season))
                    .y(d => yScale(d.x2p_percent))
                    .curve(d3.curveBasis)
            })
            .attr('class', 'line')
            .style("fill", "none")
            .attr('stroke-width', "2px")
            .style("opacity", 0.05)
            .attr("stroke", function (d) {
                console.log(d)
                return 'black'
            });

    /*pathSelect
        .append('path')
        .datum(data2)
        .attr('class', 'line')
        .attr("d", line(data2))
        .style("fill", "none")
        .attr('stroke-width', "2px")
        .style("opacity", 0.05)
        .attr("stroke", function (d) {
            return 'black'
        });*/
    })
