var margin = {top: 20, right: 30, bottom: 30, left: 60};
var width = $("#linesvg").width() - margin.left - margin.right;
var height = $("#linesvg").height() - margin.top - margin.bottom;
var svg = d3.select("#linesvg").append('svg')
            .attr("width",  width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

      var parseTime = d3.timeParse("%Y")
          bisectDate = d3.bisector(function(d) { return d.year; }).left;

      var country = "Portugal";

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

      d3.json("mortalityratenotsorted.json", function(error, data) {
          if (error) throw error;
          var ret = data.filter(function(d) {
            if( "Portugal" === d.name || "Albania" === d.name )
                  return d;
            });

            var xMin = 99999;
            var xMax = 0;
            var yMin = 99999999999999;
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

          x.domain([xMin, xMax]);
          y.domain([yMin * 0.9, yMax]);


          const lineWrapper = g.selectAll('.line-wrapper')
          .data(ret, function(d) {
              return d.name;
          })
          .enter().append("g")
          .attr("class", "line-wrapper");

        
        lineWrapper.append("path")
            .attr("class", "line")
            .attr("stroke", function(d) {
                return d.color || "#FF0000";
            })
            .attr("stroke-width", "3px")
            .attr("d", function(d) {
                return line(d.values);
            });


            var axisY = d3.axisLeft(y)
                //.tickValues([]);

          g.append("g")
              .attr("class", "axis axis--x")
							.attr("transform", "translate(0," + height + ")")
							.call(d3.axisBottom(x)
									.ticks(6))
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
              .attr("transform", "translate(" + 0 + "," + -20 + ")")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .style("font-size", "14px")
              .style("font-weight", "lighter")
              .attr("fill", "#5D6971")
              .text("Rate");

          var focus = g.append("g")
              .attr("class", "foc8us")
              .style("display", "none");

          focus.append("line")
              .attr("class", "x-hover-line hover-line")
              .attr("y1", 0)
              .attr("y2", height);

          focus.append("line")
              .attr("class", "y-hover-line hover-line")
              .attr("x1", width)
              .attr("x2", width);

          focus.append("circle")
              .attr("r", 7.5);

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
                  var xPosition = x.invert(d3.mouse(this)[0]);
                  var str = String(xPosition);
                  var res = str.split(" ");
                  var year = res[3];
                  $( "#current_year" ).val(year);
                  $( "#slider-range-max" ).slider({
                      value: year
                  });
                  current_year = $( "#slider-range-max" ).slider( "value" ) ;
                      changeWorldMap2(year);
                });


        function changeWorldMap2(yr){
            console.log("chegueiiii");
            if (1990 <= yr && current_year <= 1994) {
                filename = filename_template + "1990.tsv";
                console.log(filename);
            }
            
            if (1995 <= yr && yr <= 1999) {
                filename = filename_template + "1995.tsv";
                console.log(filename);
            }
            
            if (2000 <= yr && yr <= 2004) {
                filename = filename_template + "2000.tsv";
                console.log(filename);
            }
            
            if (2005 <= yr && yr <= 2009) {
                filename = filename_template + "2005.tsv";
                console.log(filename);
            }
            
            if (2010 <= yr && yr <= 2015) {
                filename = filename_template + "2010.tsv";
                console.log(filename);
            }
            
            queue()
                .defer(d3.json, 'world_countries.json')
                .defer(d3.tsv, filename)
                .await(ready);
            }

          function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(ret, x0, 1),
                d0 = ret[i - 1],
                d1 = ret[i],
                d = x0 - d0.year > d1.year - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
            focus.select("text").text(function() { return d.value; });
            focus.select(".x-hover-line").attr("y2", height - y(d.value));
            focus.select(".y-hover-line").attr("x2", width + width);
          }
      });
