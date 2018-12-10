var DATA_FILE_LOC = 'sanitation_gooey_format.tsv';
var USER_YEAR = '2015'; // default user year


// var cells = [[10,10], [93,10], [176,10], [259,10], [342,10],
//          [10,93], [93,93], [176,93], [259,93], [342,93],
//          [10,176], [93,176], [176,176], [259,176], [342,176],
//          [10,259], [93,259], [176,259], [259,259], [342,259]]

var cells = [[152,152], [322,152], [237,322], [237,67], [67,322], [407,67], [407,322], [67,67],
              [152,322], [237,237], [152,67], [407,237], [67,152], [152,237], [322,237], [322,67],
              [322,322], [67,237], [407,152], [237,152]]




var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
var node_radius = 13,
    padding = 1,
    cluster_padding = 1,
    num_nodes = 100;


var svg = d3.select("#gooeychart").append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

///////////////////////////////////////////////////////////////////////////
///////////////////////////// Create filter ///////////////////////////////
/////////////////////////////////////////////////////////////////////////// 

//SVG filter for the gooey effect
//Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/


var defs = svg.append("defs");
var filter = defs.append("filter").attr("id","gooeyCodeFilter");
filter.append("feGaussianBlur")
  .attr("in","SourceGraphic")
  .attr("stdDeviation","10")
  //to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
  .attr("color-interpolation-filters","sRGB") 
  .attr("result","blur");
filter.append("feColorMatrix")
  .attr("in","blur")
  .attr("mode","matrix")
  .attr("values","1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7")
  .attr("result","gooey");

// Foci
var color1 = "#ff8000";
var foci = {
    "dragger": { x: 0, y: 0, color: color1 }
};

// SAMPLE COUNTRIES
var s_countries = ["Antigua and Barbuda", "Comoros", "Russia", "Spain", "Portugal", "France", "Denmark", "Sweden", "China", "Germany",
                    "Ghana"]
// USA does not work - probably because there are two things with USA on the TSV, US and US virgin islands

var root;

var year_data = {};
d3.tsv(DATA_FILE_LOC, type, function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
        year_data[d.year] = d;
  });

    // Create node objects
    var nodes = [{ radius: 0, fixed: true, choice: "dragger" }];
    root = nodes[0];

    var nodes_so_far = 1;
    d3.keys(year_data[USER_YEAR]).forEach(function(c) {
        var str = String(c);

        if (str != "year") {
          console.log(s_countries);
          d3.range(0, 8 * year_data[USER_YEAR][str]).map(function(o, i) {

              nodes_so_far += 1;

              // colours are generating randomly but we should get them from the other vector
              foci[str] = { 
                x : 25 + 475 * Math.random(),
                y : 25 + 325 * Math.random(),
                color : 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'
              };


              if (s_countries.includes(str)) {
                console.log(str);
                if (cells.length > 0 && s_countries.length > 0) {

                  var pos = cells[0];
                  console.log("AQUI 1");
                  console.log(pos);
                  cells.splice(0, 1);
                  console.log("AQUI 2");
                  console.log(cells);

                  foci[str] = { 
                    x : pos[0],
                    y : pos[1],
                    color : 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'
                  };                  
                }

                
                //s_countries.splice(s_countries.indexOf(str), 1);
                console.log(s_countries);

                nodes.push({
                    id: "node" + nodes_so_far,
                    x: foci[str].x ,
                    y: foci[str].y ,
                    radius: node_radius,
                    choice: str
                });
              }
          });

        }
    });


    // Force-directed layout
    var force = d3.layout.force()
      .nodes(nodes)
      .size([width, height])
        .gravity(0)
        .charge(function(d, i) { return i ? 0 : -400; })
      .friction(.93)
      .on("tick", tick)
      .start();

    var circleWrapper = svg.append("g")
      .attr("class", "circleWrapper")
      .style("filter", "url(#gooeyCodeFilter)");



// Draw circle for each node.
var circle = circleWrapper.selectAll("circle")
  .data(nodes)
  .enter().append("circle")
  .attr("id", function(d) { return d.id; })
  .attr("class", "node")
  .style("fill", function(d) { return foci[d.choice].color; });    

// For smoother initial transition to settling spots.
circle.transition()
  .duration(900)
  .delay(function(d,i) { return i * 5; })
  .attrTween("r", function(d) {
    var i = d3.interpolate(0, d.radius);
    return function(t) { return d.radius = i(t); };
  });


    // Labels etc
    d3.keys(foci).forEach(function(d) {
    
        if (d != "dragger") {
            // Headers
            svg.append("text")
                .attr("class", "header")
                .attr("x", foci[d].x)
                .attr("y", foci[d].y-80)
                .attr("text-anchor", "middle")
            //    .text(d);

            // Counters
            svg.append("text")
                .attr("id", "counter"+d)
                .attr("class", "counter")
                .attr("data-choice", d)
                .attr("x", foci[d].x)
                .attr("y", foci[d].y)
                .attr("text-anchor", "middle")
           //     .text(year_data[USER_YEAR][d] + "%");
        }
    
    });

    // Country dropdown menu
    d3.select("#dropdown_title").html(USER_YEAR);
    d3.select(".dropdown-menu").selectAll("li")
        .data(data)
      .enter().append("li").append("a")
        .text(function(d) { return d.year; })
        .on("click", function() {
            var selText = d3.select(this).text();
            d3.select("#dropdown_title").html(selText);
            
            USER_YEAR = selText;
            timer();
        });

        

    // d3.select("#button").on("click", function(d) {
    //     if (USER_YEAR == "usa") {
    //         USER_YEAR = "Australia";
    //     } else {
    //         USER_YEAR = "Paraguay";
    //     }
    //     console.log(USER_YEAR);
    //
    //     timer();
    // })
        
    svg.on("mousemove", function() {
        var p1 = d3.mouse(this);
        
        //console.log( d3.event.pageX, d3.event.pageY ) // log the mouse x,y position
        
        root.px = p1[0];
        root.py = p1[1];
        force.resume();
      });



    // Run function periodically to make things move.
    var timeout;
    function timer() {
    
        nodes_so_far = 1;
        d3.keys(year_data[USER_YEAR]).forEach(function(c) {
            if (year_data[USER_YEAR][c] > 0) {
                d3.range(0, year_data[USER_YEAR][c]).map(function(o, i) {
                    if (nodes_so_far <= 100) {
                        nodes[nodes_so_far].choice = c;
                        nodes_so_far += 1;
                    }
                    
                    
                });
            }
        });
    
        force.resume();
    
    
        d3.selectAll("text.counter")
          .transition()
          .duration(600)
          .tween("text", function(d) {
            var re = /(\d+)%/;
            var meta_array = re.exec(this.textContent);
            if (meta_array) {
              var just_number = meta_array[1];
              if (just_number.substring(0,1) == "<") {
                  just_number = just_number.substring(1);
              }
            } else {
                var just_number = 0;
              }
    
            var choice = d3.select(this).attr("data-choice");
            var new_pct = year_data[USER_YEAR][choice];
            console.log(choice);
        
            var i = d3.interpolate(just_number, new_pct);
            return function(t) {
                if (i(t) < 1 && i(t) > 0) {
                  this.textContent = "<1%";
              } else {
                  this.textContent = Math.round(i(t)) + "%";
                }
            }
      });
    
    
        // Run it again in a few seconds.
        // timeout = setTimeout(timer, 400);
    }



    //
    // Force-directed boiler plate functions
    //


    function tick(e) {
      circle
      .each(gravity(.051 * e.alpha))
        .each(collide(.5))
        .style("fill", function(d) { return foci[d.choice].color; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    }


    // Move nodes toward cluster focus.
    function gravity(alpha) {
      return function(d) {
        d.y += (foci[d.choice].y - d.y) * alpha;
        d.x += (foci[d.choice].x - d.x) * alpha;
      };
    }



    // Resolve collisions between nodes.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function(d) {
        var r = d.radius + node_radius + Math.max(padding, cluster_padding),
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + (d.choice === quad.point.choice ? padding : cluster_padding);
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }    
}); // @end d3.tsv()








function type(d, i) {
  
  d3.keys(d).map(function(key) {
        if (key != "country") {
            d[key] = +d[key];
        }
  });
  return d;

} 
