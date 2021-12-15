// The map
const svgMap = d3.select("#world"),
    widthMap = +svgMap.attr("width"),
    heightMap = +svgMap.attr("height");

// Map and projection
svgMap.call(responsivefy);
const path = d3.geoPath();
const projection = d3
    .geoMercator()
    .scale(115)
    .center([0, 20])
    .translate([widthMap / 2.2, heightMap / 2]);

// Load data
Promise.all([d3.json("continents.json")]).then(function (loadData) {
    let topo = loadData[0];

    function mouseOver() {
        d3.select(this).transition().duration(200).style("opacity", 1);
    }

    function mouseLeave() {
        d3.select(this).transition().duration(200).style("opacity", 0.8);
    }

    function mouseClick() {
        d3.select("#world").selectAll("*").transition().duration(200).style("stroke", "transparent");
        d3.select(this).transition().duration(200).style("stroke", "white");
        d3.select("#chart").selectAll("path").remove();
        // Update chart with id
        update(this.id);
    }

    // Draw the map
    svgMap
        .append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .call(responsivefy)
        // draw each continent and give proper id
        .attr("d", d3.geoPath().projection(projection))
        .attr("id", function (d) {
            return d.properties.CONTINENT;
        })
        .style("stroke", "transparent")
        .style("fill", "#0AEAF2")
        .style("opacity", 0.8)
        .style("cursor", "pointer")
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseLeave)
        .on("click", mouseClick);
});

// The chart
const margin = { top: 25, right: 15, bottom: 20, left: 30 },
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add X axis
const x = d3.scaleLinear().range([0, width]);
const xAxis = d3.axisBottom().scale(x).tickFormat(d3.format("d"));
svg.append("g")
.attr("transform", `translate(0, ${height})`)
.attr("class", "myXaxis")
.style("color", "white")
// text label for the x axis
svg.append("text")             
.attr("y", -10)
.attr("x", 70)
.style("text-anchor", "middle")
.style("fill", "white")
.text("phenomena per Year");


// Add Y axis
const y = d3.scaleLinear().range([height, 0]);
const yAxis = d3.axisLeft().scale(y);
svg.append("g")
.attr("class", "myYaxis")
.style("color", "white")




// This allows to find the closest X index of the mouse:
let bisect = d3.bisector(function (d) {
    return d.year;
}).left;

// Create the circle that travels along the curve of chart
let focus = svg.append("g").append("circle").style("fill", "none").attr("stroke", "black").attr("r", 8.5).style("opacity", 0);

// Create the text that travels along the curve of chart
let focusText = svg.append("g").append("text").style("opacity", 0).attr("text-anchor", "left").attr("alignment-baseline", "middle");

let n;

function update(selectedVar) {
    let lineId = -1; // Line id
    // Parse the Data
    d3.json(`/data/${selectedVar}`, {
        method: "POST",
    }).then(function (response) {
        const data = response.data;

        // Group the data
        const typer = d3.group(data, (d) => d.disaster_type);

        console.log(data);

        x.domain(
            d3.extent(data, function (d) {
                return d.year;
            })
        );
        svg.selectAll(".myXaxis").call(xAxis);

        y.domain([
            0,
            d3.max(data, function (d) {
                return +d.count;
            }),
        ]);
        svg.selectAll(".myYaxis").transition().duration(1000).call(yAxis);

        const color = d3.scaleOrdinal().range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"]);

        svg.append("rect").style("fill", "none").style("pointer-events", "all").attr("width", width).attr("height", height);

        svg.selectAll(".line")
            .data(typer)
            .join("path")
            .on("mouseover", lineMouseOver)
            .on("mousemove", (event) => {
                
                let x0 = x.invert(d3.pointer(event)[0]);
                let i = bisect(typer.get(n), x0, 1);
                selectedData = typer.get(n)[i];
                console.log(i);
                focus.attr("cx", x(selectedData.year)).attr("cy", y(selectedData.count));
                focusText
                    .html(selectedData.count)
                    .attr("x", x(selectedData.year) + 15)
                    .attr("y", y(selectedData.count));
            })
            .on("mouseleave", lineMouseLeave)
            .transition()
            .duration(1000)
            .attr("class", "myLine")
            .attr("id", function(){
                let id = ["Drought", "Extreme temperature", "Flood", "Storm", "Wildfire"]
                lineId++;
                return id[lineId];
            })
            .attr("d", function (d) {
                return d3
                    .line()
                    .x(function (d) {
                        return x(d.year);
                    })
                    .y(function (d) {
                        return y(d.count);
                    })(d[1]);
            })
            .attr("fill", "none")
            .attr("stroke", function (d) {
                return color(d);
            })
            .attr("stroke-width", 2)
            .attr("shape-rendering", "geometricPrecision");
    });
}

update("1");

function lineMouseOver() {
    n = this.id;
    console.log(this.id)
    svg.selectAll(".myLine").transition().duration(200).style("opacity", 0.2);
    d3.select(this).transition().duration(200).style("opacity", 1);
    focus.style("opacity", 1);
    focusText.style("opacity", 1);
}

function lineMouseLeave() {
    svg.selectAll(".myLine").transition().duration(200).style("opacity", 1);
    focus.style("opacity", 0);
    focusText.style("opacity", 0);
}

function responsivefy(svg) {
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width"), 10),
        height = parseInt(svg.style("height"), 10),
        aspect = width / height;

    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "xMinYMid").call(resize);

    d3.select(window).on("resize." + container.attr("id"), resize);

    function resize() {
        const w = parseInt(container.style("width"));
        svg.attr("width", w);
        svg.attr("height", Math.round(w / aspect));
    }
}

// Scroll into view
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});
