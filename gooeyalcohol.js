var DATA_FILE_LOC = 'drinks.tsv';
var USER_COUNTRY = 'United States of America';

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
    
var node_radius = 13,
    padding = 1,
    cluster_padding = 1,
    num_nodes = 100;

var fake_data = {
    usa: { beer: 25, wine: 25, other: 25, spirits: 25 },
    australia: { beer: 5, wine: 15, other: 15, spirits: 65 },
};


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
    "beer": { x: 150, y: 150, color: color1 },
    "wine": { x: 400, y: 150, color: color1 },
    "spirits": { x: 150, y: 400, color: color1 },
    "other": { x: 400, y: 400, color: color1 },
    "dragger": { x: 0, y: 0, color: color1 },
};

var root;

var country_data = {};
d3.tsv(DATA_FILE_LOC, type, function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
        country_data[d.country] = d;
  });

    // Create node objects
    var nodes = [{ radius: 0, fixed: true, choice: "dragger" }];
    root = nodes[0];

    var nodes_so_far = 1;
    d3.keys(country_data[USER_COUNTRY]).forEach(function(c) {
        d3.range(0, country_data[USER_COUNTRY][c]).map(function(o, i) {
            nodes_so_far += 1;
            nodes.push({
                id: "node" + nodes_so_far,
                x: foci[c].x + Math.random(),
                y: foci[c].y + Math.random(),
                radius: node_radius,
                choice: c,
            });
        });
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
           //     .text(country_data[USER_COUNTRY][d] + "%");
        }
    
    });

    // Country dropdown menu
    d3.select("#dropdown_title").html(USER_COUNTRY);
    d3.select(".dropdown-menu").selectAll("li")
        .data(data)
      .enter().append("li").append("a")
        .text(function(d) { return d.country; })
        .on("click", function() {
            var selText = d3.select(this).text();
            d3.select("#dropdown_title").html(selText);
            
            USER_COUNTRY = selText;
            timer();
        });

        

    // d3.select("#button").on("click", function(d) {
    //     if (USER_COUNTRY == "usa") {
    //         USER_COUNTRY = "Australia";
    //     } else {
    //         USER_COUNTRY = "Paraguay";
    //     }
    //     console.log(USER_COUNTRY);
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
        d3.keys(country_data[USER_COUNTRY]).forEach(function(c) {
            if (country_data[USER_COUNTRY][c] > 0) {
                d3.range(0, country_data[USER_COUNTRY][c]).map(function(o, i) {
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
            var new_pct = country_data[USER_COUNTRY][choice];
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
