// The map
// The svg
const svgMap = d3.select("#world"),
    width = +svgMap.attr("width"),
    height = +svgMap.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3
    .geoMercator()
    .scale(140)
    .center([0, 20])
    .translate([width / 2, height / 2]);

// Load external data and boot
Promise.all([d3.json("continents.json")]).then(function (loadData) {
    let topo = loadData[0];

    let mouseOver = function (d) {
        d3.select(this).transition().duration(200).style("opacity", 1);
    };

    let mouseLeave = function (d) {
        d3.select(this).transition().duration(200).style("opacity", 0.8);
    };

    let mouseClick = function (d) {
        d3.select("#world").selectAll("*").transition().duration(200).style("stroke", "transparent");
        d3.select(this).transition().duration(200).style("stroke", "white");
        // Update chart with id
        update(this.id);
        console.log(this.id);
    };

    // Draw the map
    svgMap
        .append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each continent and give proper id
        .attr("d", d3.geoPath().projection(projection))
        .attr("id", function (d) {
            return d.properties.CONTINENT;
        })
        .style("stroke", "transparent")
        .style("fill", "#07b8bf")
        .style("opacity", 0.8)
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
        .on("click", mouseClick);
});

// The chart
// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    chartWidth = 500 - margin.left - margin.right,
    chartHeight = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", chartWidth + margin.left + margin.right)
    .attr("height", chartHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize the X axis
const x = d3.scaleBand().range([0, chartWidth]).padding(0.2);
const xAxis = svg.append("g").attr("transform", `translate(0,${chartHeight})`).style("color", "white");

// Initialize the Y axis
const y = d3.scaleLinear().range([chartHeight, 0]);
const yAxis = svg.append("g").attr("class", "myYaxis").style("color", "white");

// A function that create / update the plot for a given variable:
function update(selectedVar) {
    // Parse data
    d3.json("/data", {
        method: "POST",
    }).then(function (response) {
        const data = response.data; // Hent data ud af response
        d3.select("#deaths").select("span").attr("id", "deathsSpan").text(data[selectedVar].deaths).style("font-size", "45px");

        d3.select("#damages")
            .select("span")
            .attr("id", "damagesSpan")
            .text(data[selectedVar].damages + "$")
            .style("font-size", "45px");
    });

    // Parse the other Data
    d3.json("/type", {
        method: "POST",
    }).then(function (response) {
        const data = response.data;

        let dataArray = [];

        console.log(data)
        for (let i = 0; i < 5; i++) {
            dataArray.push(data[[selectedVar] * 5 + i]);
        }
        console.log(dataArray);
        // X axis
        x.domain(dataArray.map((d) => d.disaster_type));
        xAxis.transition().duration(1000).call(d3.axisBottom(x)).selectAll("text").attr("transform", "translate(-10,0)rotate(-45)").style("text-anchor", "end").style("color", "white");

        // Add Y axis
        y.domain([0, d3.max(dataArray, (d) => +d.count)]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y)).call(d3.axisLeft(y)).selectAll("text").style("color", "white");

        // variable u: add data to existing bars
        const u = svg.selectAll("rect").data(dataArray);

        // update bars
        u.join("rect")
            .transition()
            .duration(1000)
            .attr("x", (d) => x(d.disaster_type))
            .attr("y", (d) => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", (d) => chartHeight - y(d.count))
            .attr("fill", "#cf8838")
            .attr("opacity", "1");
    });
}

// Initialize plot
update("0");

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});
