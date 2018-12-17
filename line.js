var margin = {top: 30, right: 40, bottom: 40, left: 60};
var width = $("#linesvg").width() - margin.left - margin.right;
var height = $("#linesvg").height() - margin.top - margin.bottom;
var svg = d3.select("#linesvg").append('svg')
            .attr("width",  width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

var parseTime = d3.timeParse("%Y")
bisectDate = d3.bisector(function(d) { return d.year; }).left;

var x = d3.scaleTime()    
    .range([0, width]);
var y = d3.scaleLinear()
    .range([height, 0]);

var line = d3.line()
.x(function(d) { return x(d.year); })
.y(function(d) { return y(d.value); })
.curve(d3.curveMonotoneX);

var g = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


x.domain([1990, 2015]);
y.domain([0, 100]);

var axisY = d3.axisLeft(y)
var axisX = d3.axisBottom(x).tickFormat(d3.format(""))
                            .ticks(6)
g.append("g")
    .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(axisX)
    .append("text")
    .attr("class", "axis-title")
    .attr("transform", "translate(" + width + "," + 30 + ")")
    .style("font-size", "14px")
    .style("font-weight", "lighter")
    .text("Year");

g.append("g")
    .attr("class", "axis axis--y")
    .call(axisY)
.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(0)")
    .attr("transform", "translate(" + 0 + "," + -30 + ")")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("font-size", "14px")
    .style("font-weight", "lighter")
    //.attr("fill", "#5D6971")
    .text("Rate");


var lineData;
d3.json("mortalityratenotsorted.json", function(error, data) {
    if (error) throw error;

    lineData = data;

});

$(document).on('countriesSelected', function(e, args) {
    const { countriesSelected } = args;
    changeLines(countriesSelected);
})
       
function changeLines(countriesSelected) {

    var ret = lineData.filter(function(d) {
        return countriesSelected.includes(d.name);
    });


    var xMin = 99999;
    var xMax = 0;
    var yMin = 9999999999999;
    var yMax = 0;

    ret.forEach(function(d) {
        d.name = d.name;
        d.values.forEach(function(d1){
            if (xMin > d1.year) {
                xMin = d1.year;
            }
            if (xMax < d1.year) {
                xMax = d1.year;
            }
            if (yMin > +d1.value ) {
                yMin = d1.value;
            }
            if (yMax < +d1.value) {
                yMax = d1.value;
            }
            d1.value = +d1.value;
        });
    });

    x.domain([1990, 2015]);
    y.domain([yMin * 0.9, yMax* 1.1]);

  
    if(countriesSelected.length == 0){
        y.domain([0, 100]);
    }

    g.select('.axis.axis--y')
        .transition()
        .duration(800)
        .call(axisY)


    const lineWrapper = g.selectAll('.line-wrapper')
        .data(ret, function(d) {
            return d.name;
        });


    lineWrapper.exit()
      .transition()
      .duration(800)
      .style("opacity", "0")
      .style("stroke-width", "0")
      .remove();


    lineWrapper.enter()
        .append("g")
        .attr("class", "line-wrapper")
        .append("path")
        .style("fill", "none")
        .style("opacity", "0")
        .style("stroke-width", "0");

    g.selectAll('.line-wrapper path')
        .transition()
        .duration(800)
        .style("stroke", function(d) {
          $( "#selectedCountry" ).find("li:contains('" + d.name + "')").find("span.coloring").css( "background-color", d.color );
          return d.color;

        })
        .attr("d", function(d) {
            return line(d.values);
        })
        .style("opacity", "1")
        .style("stroke-width", "3px");


var focus = g.append("g")
              .attr("class", "focus")
              .style("display", "none");

          focus.append("line")
              .attr("class", "x-hover-line hover-line")
              .attr("y1", 0)
              .attr("y2", height);

          focus.append("line")
              .attr("class", "y-hover-line hover-line")
              .attr("x1", width)
              .attr("x2", width);

          

          focus.append("text")
              .attr("x", 15)
              .attr("dy", ".31em");


          svg.append("rect")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
              .attr("class", "overlay")
              .attr("width", width)
              .attr("height", height)
              .on("mouseover", function() { focus.style("display", null); })
              .on("mouseout", function() { focus.style("display", "none"); })
              .on("mousemove", mousemove)
              .on("click", function(){
                  var coord = d3.mouse(this);

                  var xPosition = Math.round(x.invert(d3.mouse(this)[0]));

                  var str = String(xPosition);

                  var res = str.split(" ");

                  var year = res[0];
                  $(document).trigger('yearSelected', {year, countriesSelected});
                 // $(document).trigger('yearSelected2', {year, countriesSelected});

                  $( "#current_year" ).val(year);
                  $( "#slider-range-max" ).slider({
                      value: year
                  });
                  current_year = $( "#slider-range-max" ).slider( "value" ) ;
                      changeWorldMap2(year);
                });


        function changeWorldMap2(yr){
            if (1990 <= yr && current_year <= 1994) {
                filename = filename_template + "1990.tsv";

            }
            
            if (1995 <= yr && yr <= 1999) {
                filename = filename_template + "1995.tsv";

            }
            
            if (2000 <= yr && yr <= 2004) {
                filename = filename_template + "2000.tsv";

            }
            
            if (2005 <= yr && yr <= 2009) {
                filename = filename_template + "2005.tsv";

            }
            
            if (2010 <= yr && yr <= 2015) {
                filename = filename_template + "2010.tsv";

            }
            
            queue()
                .defer(d3.json, 'world_countries.json')
                .defer(d3.tsv, filename)
                .await(ready);
        }

          function mousemove() {
            for (a=0; a < ret.length; a++) {
              var x0 = x.invert(d3.mouse(this)[0]),
                  i = bisectDate(ret[a].values, x0, 1),
                  d0 = ret[a].values[i - 1],
                  d1 = ret[a].values[i],
                  d = x0 - d0.year > d1.year - x0 ? d1 : d0;
              focus.attr("transform", "translate(" + x(d.year) + "," + 0 + ")");
              //focus.select("text").text(function() { return d.value; });
              //focus.select(".x-hover-line").attr("y2", height);
              //focus.select(".y-hover-line").attr("x2", width + width);
            }
          }



}

         
