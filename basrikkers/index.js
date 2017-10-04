var svg = d3.select("svg"),
    margin = {
        top: 0,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// parse the time to different format

var parseTime = d3.timeParse("%Y%0m%0d");
// width canvas
var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);
// the line
var line = d3.line()
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.temp);
    });
//loading data
d3.csv("data.csv", function (d) {

    d.date = parseTime(d.date);

    d.temp = +d.temp;
    return d;

}, function (error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function (d) {

        return d.date;

    }));
    // y domain. added both sides 10 to scale for a better looking graph
    y.domain([-10, d3.max(data, function (d) {
        return (d.temp + 10);
    })]);




    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Tempature (C)");

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#bc131c") // changed color of the line
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);


});