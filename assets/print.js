var w = 1000;
var h = 1000;

function createSVG(selector) {
    return d3.select(selector)
        .append("svg")
        .attr('width', w)
        .attr('height', h);
}

function pieChart(selector, getData, dataItemSelector) {
    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) { return d[dataItemSelector]; });

    var svg = d3.select(selector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
        .data(pie(getData().slice(0, 20)))
        .enter()
        .append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return color(d.data['entity']); });

    g.append("text")
        .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function (d) {
            if (d.data['entity']) {
                var i = d.data['entity'].lastIndexOf("/");
                return d.data['entity'].slice(i + 1) + ", " + d.data[dataItemSelector];
            }
        });

    function type(d) {
        d[dataItemSelector] = +d[dataItemSelector];
        return d;
    }
}

function bubbleChart(selector, getData, dataItemSelector) {
    var svg = createSVG(selector);

    var format = d3.format(',d');

    var color = d3.scaleOrdinal(d3.schemeCategory20c);

    var pack = d3.pack()
        .size([w, h])
        .padding(1, 5);

    var root = d3.hierarchy({ children: getData() })
        .sum(function (d) { return d[dataItemSelector]; })
        .each(function (d) {
            if (id = d.data['entity']) {
                var id, i = id.lastIndexOf("/");
                d.id = id;
                d.package = id.slice(0, i);
                d.class = id.slice(i + 1);
            }
        });

    var node = svg.selectAll(".node")
        .data(pack(root).leaves())
        .enter()
        .filter(function (d, i) { return i < 200; })
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("id", function (d) { return d.id; })
        .attr("r", function (d) { return d.r; })
        .style("fill", function (d) { return color(d.package); });

    node.append("clipPath")
        .attr("id", function (d) { return "clip-" + d.id; })
        .append("use")
        .attr("xlink:href", function (d) { return "#" + d.id; });

    node.append("text")
        .attr("clip-path", function (d) { return "url(#clip-" + d.id + ")"; })
        .selectAll("tspan")
        .data(function (d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
        .enter().append("tspan")
        .attr("x", 0)
        .attr("y", function (d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
        .text(function (d) { return d; });

    node.append("title")
        .text(function (d) { return d.id + "\n" + format(d.value); });
}

function printBarChart(selector, getData, dataItemSelector) {
    var h = 400;
    var svg = d3.select(selector)
        .append("svg")
        .attr('width', w)
        .attr('height', 400);
        
    var data = getData();
    svg.selectAll('rect')
        .data(data)
        .enter()
        .filter(function (d, i) {
            return i < 50;
        })
        .append("rect")
        .attr("x", function (d, i) {
            return i * (w / 50);
        })
        .attr("y", function (d) {
            return h - (d[dataItemSelector] * 4);
        })
        .attr("width", 20)
        .attr("height", function (d) {
            return d[dataItemSelector] * 4;
        })
        .attr('fill', function (d) {
            return "rgb("+ (d[dataItemSelector] * 10) +",0,0)";
        });

    svg.selectAll('text')
        .data(data)
        .enter()
        .filter(function (d, i) {
            return i < 50;
        })
        .append('text')
        .text(function (d) {
            return d[dataItemSelector];
        })
        .attr('x', function (d, i) {
            return i * (w / 50) + 10;
        })
        .attr('y', function (d) {
            return h - (d[dataItemSelector] * 4) + 15;
        })
        .attr('font-family', 'sans-serif')
        .attr('font-size', '11px')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle');
}

function printBars(selector, getData, dataItemSelector) {
    d3.select(selector)
        .selectAll("div")
        .data(getData())
        .enter()
        .append("div")
        .attr("class", "bar")
        .style("height", function (d) {
            return (d[dataItemSelector] * 5) + "px";
        })
        .style("margin-right", "10px");
}

function printStraightLineCircles(selector, getData, dataItemSelector) {
    var svg = createSVG();

    var circles = svg.selectAll('circle')
        .data(getData())
        .enter()
        .append('circle');

    circles.attr('cx', function (d, i) {
        return (i * 50) + 25;
    })
        .attr('cy', h / 2)
        .attr('r', function (d) {
            return d[dataItemSelector];
        })
        .attr("fill", "yellow")
        .attr("stroke", "orange")
        .attr("stroke-width", function (d) {
            return d[dataItemSelector] / 2;
        });
}

function printRawData(selector, getData) {
    d3.select(selector)
        .append('p')
        .text('entity, n-authors, n-revs');
    d3.select(selector)
        .selectAll("p")
        .data(getData())
        .enter()
        .append("p")
        .text(getString)
        .style('color', function (d) {
            if (d[numOfAuthorsSelector] > 5) {
                return "red";
            } else if (d[numOfAuthorsSelector] > 3) {
                return "orange";
            }
        });
}

exports.printBars = printBars;
exports.printRawData = printRawData;
exports.printStraightLineCircles = printStraightLineCircles;
exports.printBarChart = printBarChart;
exports.bubbleChart = bubbleChart;
exports.pieChart = pieChart;