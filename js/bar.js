var margin = {top: 10, right: 30, bottom: 40, left: 100},
    width = 460 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let standing = d3.csv("data/Win Percentages.csv", d =>{
    d.w = +d.w
    return d
}).then(data => {
    console.log(data)
    barDraw(data)
})

function barDraw(data) {

    // tooltip to display more info

    var tooltip = d3.select("#tool")
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

    var w_mousemove = function (event, d) {
        tooltip
            .html("TEAM: " + d.team.toUpperCase() + "<br>" + "TOTAL WINS: " + d.w + "<br>" + "SEASON: " + d.season)
    }

    // A function that changes this tooltip when cursor leaves; set opacity to 0 again
    var mouseleave = function (d) {
        tooltip
            .transition()
            .duration(500)
            .style("opacity", 0)
    }

    // begin displaying data at default selected season
    var sel_data = data.filter(function (d) {
        var sel = d3.select("#select2").property("value");
        return d.season === sel;
    });

    // Append svg drawing area
    let w_svg = d3.select("#bar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleLinear()
        .domain([0, 80])
        .range([0, width])
    w_svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("color", "black")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0) rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(function (d) {
            return d.abbreviation;
        }))
        .padding(1);

    w_svg.append("g")
        .style("color", "black")
        .call(d3.axisLeft(y))

    w_svg.append("g").selectAll(".bar")
        .data(sel_data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", function(d){
            if (d.team === "San Antonio Spurs") {
                return "#EF426F"
            }
            else {
                return "black"
            }
        })

        .attr("x", x(0))
        .attr("y", function (d) {
            return y(d.abbreviation);
        })
        .attr("width", function (d) {
            return x(d.w)
        })
        .attr("height", 4)
        .on("click", mouseover)
        .on("mousemove", w_mousemove)
        .on("mouseleave", mouseleave);;

    // add a change event handler
    d3.select("#select2").on("change", function () {
        Filter(this.value);
    });

    // function that filters by season
    function Filter(value) {
        // filter the data
        var filter = data.filter(function (d) {
            return d.season === value;
        })

        // update bar chart
        d3.selectAll(".bar")
            .data(filter)
            .transition().duration(1000)
            .attr("x", x(0))
            .attr("y", function (d) {
                return y(d.abbreviation);
            })
            .attr("width", function (d) {
                return x(d.w)
            })
    }
}