// The map
// The svg
const svgMap = d3.select("#world"),
    widthMap = +svgMap.attr("width"),
    heightMap = +svgMap.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3
    .geoMercator()
    .scale(130)
    .center([0, 20])
    .translate([widthMap / 2.2, heightMap / 2]);

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
        d3.select("#chart").selectAll("path").remove();
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

// set the dimensions and margins of the graph
const margin = { top: 25, right: 15, bottom: 20, left: 30 },
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

// Add X axis
const x = d3.scaleLinear().range([0, width]);
const xAxis = d3.axisBottom().scale(x);
svg.append("g").attr("transform", `translate(0, ${height})`).attr("class", "myXaxis").style("color", "white");

// Add Y axis
const y = d3.scaleLinear().range([height, 0]);
const yAxis = d3.axisLeft().scale(y);
svg.append("g").attr("class", "myYaxis").style("color", "white");

let sumstat;

function update(selectedVar) {
    // Parse the other Data
    d3.json(`/data/${selectedVar}`, {
        method: "POST",
    }).then(function (response) {
        const data = response.data;

        // group the data: I want to draw one line per group
        sumstat = d3.group(data, (d) => d.disaster_type); // nest function allows to group the calculation per level of a factor

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
            })
        ]);
        svg.selectAll(".myYaxis").transition().duration(1000).call(yAxis);

        // color palette
        const color = d3.scaleOrdinal().range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"]);

        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .join("path")
            .transition()
            .duration(1000)
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
                return color(d[0]);
            })
            .attr("stroke-width", 3);
    });
}
update("1");

function responsivefy(svg) {
    // container will be the DOM element
    // that the svg is appended to
    // we then measure the container
    // and find its aspect ratio
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style('width'), 10),
        height = parseInt(svg.style('height'), 10),
        aspect = width / height;
   
    // set viewBox attribute to the initial size
    // control scaling with preserveAspectRatio
    // resize svg on inital page load
    svg.attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMid')
        .call(resize);
   
    // add a listener so the chart will be resized
    // when the window resizes
    // multiple listeners for the same event type
    // requires a namespace, i.e., 'click.foo'
    // api docs: https://goo.gl/F3ZCFr
    d3.select(window).on(
        'resize.' + container.attr('id'), 
        resize
    );
   
    // this is the code that resizes the chart
    // it will be called on load
    // and in response to window resizes
    // gets the width of the container
    // and resizes the svg to fill it
    // while maintaining a consistent aspect ratio
    function resize() {
        const w = parseInt(container.style('width'));
        svg.attr('width', w);
        svg.attr('height', Math.round(w / aspect));
    }
  }

/*
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
        console.log(data);
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
*/
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});
