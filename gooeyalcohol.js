var DATA_FILE_LOC = 'sanitation_gooey_format.tsv';
var USER_YEAR = '2015'; // default user year

// var cells = [[10,10], [93,10], [176,10], [259,10], [342,10],
//          [10,93], [93,93], [176,93], [259,93], [342,93],
//          [10,176], [93,176], [176,176], [259,176], [342,176],
//          [10,259], [93,259], [176,259], [259,259], [342,259]]

var cells_orig = [[407,152], [322,152], [237,322], [237,67], [67,322], [415,67], [407,322], [67,67],
            [67,152], [237,237], [152,67], [407,237], [152,322], [152,237], [322,237], [322,67],
              [322,322], [67,237], [152,152], [237,152]]

var cells = cells_orig;

var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
    
var node_radius = 13,
  padding = 1,
  cluster_padding = 2,
  num_nodes = 100;

var svgGooey = d3v3.select("#gooeychart").append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

var g = svgGooey.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



///////////////////////////////////////////////////////////////////////////
///////////////////////////// Create filter ///////////////////////////////
/////////////////////////////////////////////////////////////////////////// 

//SVG filter for the gooey effect
//Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/

var defs = svgGooey.append("defs");
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
var s_countries = ["Antigua and Barbuda","Denmark", "China", "Russia", "Spain", "Portugal", "France",  "Ghana", "Sweden", "Germany",
  "Comoros"]
// USA does not work - probably because there are two things with USA on the TSV, US and US virgin islands

var root;

var year_data = {};


$(document).on('yearSelected', function(e, args) {
  const { year, countriesSelected } = args;
  USER_YEAR = year;
  drawGooey(countriesSelected);
});

$( function() {
  $( "#slider-range-max" ).slider({
    range: "max",
    min: 1990,
    max: 2015,
    value: $( "#current_year" ).val(),
    slide: function( event, ui ) {
      $( "#current_year" ).val(ui.value);
      current_year = $( "#slider-range-max" ).slider( "value" ) ;
   
      USER_YEAR = current_year;
     
      
      drawGooey(countriesSelected);
      drawRadarAfterUpdate(current_year, countriesSelected);

    }

  });

});





var gooeyData;
d3v3.tsv(DATA_FILE_LOC, type, function(error, info) {
  if (error) throw error;

  gooeyData = info;
  //drawGooey("countriesSelected");
});


var circleWrapper = svgGooey.append("g")
  .attr("class", "circleWrapper")
  .style("filter", "url(#gooeyCodeFilter)");

$(document).on('countriesSelected', function(e, args) {
    const { countriesSelected } = args;
    drawGooey(countriesSelected);
})

const svgLabels = svgGooey.append("g").attr("class", "labels-container");
//var nodes= [{ radius: 0, fixed: true, choice: "dragger", idd: "root" }];


function drawGooey(countriesSelected) {
  gooeyData.forEach(function(d) {
        year_data[d.year] = d;
  });

  // Create node objects
  var nodes = [{ radius: 0, fixed: true, choice: "dragger", idd: "root" }];
  root = nodes[0];

  var nodes_so_far;

  d3v3.keys(year_data[USER_YEAR]).forEach(function(c) {
    var str = String(c);

    if (str != "year") {
      if (countriesSelected.includes(str)) {

      var col = colorToCountries[str];
        
      if (foci[str] == null) {
        foci[str] = { 
          // x : pos[0],
          // y : pos[1],
          x : Math.floor(Math.random() * (550 - 50)) + 50,
          y : Math.floor(Math.random() * (350 - 50)) + 50,
          color: col
          //color : 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'
        };  
      }
      // cells.splice(0, 1);
      d3v3.range(0, 20 * year_data[USER_YEAR][str]).map(function(o, i) {

        nodes_so_far += 1;
        //console.log(str)




          nodes.push({
            //id: "node" + String(nodes_so_far),
            x: foci[str].x + Math.random(),
            y: foci[str].y + Math.random(),
            radius: node_radius,
            choice: str,
            idd: str + i
          });
        });
      }
    }
  });

    
  // Force-directed layout
  var force = d3v3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    //.charge(function(d, i) { return i ? 0 : -400; })
    .friction(.93)
    .on("tick", tick)
    .start();


svgGooey.on("mousemove", function() {
  var p1 = d3v3.mouse(this);

  //console.log( d3v3.event.pageX, d3v3.event.pageY ) // log the mouse x,y position
  
  root.px = p1[0];
  root.py = p1[1];
  force.resume();
});
  
  // Draw circle for each node.
  var circleData = circleWrapper.selectAll("circle")
    .data(nodes, function(d) {
      //console.log(d.idd);
      return d.idd;
  });


  circleData.exit().remove();

  var circle = circleData.enter().append("circle")
    .attr("id", function(d) { return d.idd; })
    .attr("class", "node")
    .style("fill", function(d) { return foci[d.choice].color; });    

  // For smoother initial transition to settling spots.
  circle.transition()
    .duration(900)
    .delay(function(d,i) { return i * 5; })
    .attrTween("r", function(d) {
      var i = d3v3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });

    const dataCountries = countriesSelected;
    console.log(dataCountries);
    const svgLabelsData = svgLabels.selectAll('text').data(dataCountries, function(d) {
      return d;
    });

    svgLabelsData.exit().remove();
    
    svgLabelsData.enter().append("text")
          .attr("id", function(d) {
            return "counter"+d;
          })
          .attr("class", "counter")
          .attr("data-choice", function(d) {
            console.log(d);
            return d;
          })
          .attr("x", function(d) {
            return foci[d].x;
          })
          .attr("y",  function(d) {
            return foci[d].y;
          })
          .style("font-weight", "lighter")
          .style("font-family", "sans serif")
         // .attr("text-anchor", "middle")
          .text(function(d) {
            return year_data[USER_YEAR][d];
          })

    

    // // Labels etc
    // d3v3.keys(foci).forEach(function(d) {
    //   if (d != "dragger") {
    //     svgGooey.data()

    //     svgGooey.append("text")
    //       .attr("id", "counter"+d)
    //       .attr("class", "counter")
    //       .attr("data-choice", d)
    //       .attr("x", foci[d].x)
    //       .attr("y", foci[d].y)
    //       .style("font-weight", "lighter")
    //       .style("font-family", "sans serif")
    //      // .attr("text-anchor", "middle")
    //       .text(year_data[USER_YEAR][d]);

    //     svgGooey.on("mousemove", function() {
    //       var p1 = d3v3.mouse(this);

    //       //console.log( d3v3.event.pageX, d3v3.event.pageY ) // log the mouse x,y position
          
    //       root.px = p1[0];
    //       root.py = p1[1];
    //       force.resume();
    //     });
    //   }   
    // });

    // // Country dropdown menu
    // d3v3.select("#dropdown_title").html(USER_YEAR);
    // d3v3.select(".dropdown-menu").selectAll("li")
    //     .data(gooeyData)
    //   .enter().append("li").append("a")
    //     .text(function(d) { return d.year; })
    //     .on("click", function() {
    //         var selText = d3v3.select(this).text();
    //         d3v3.select("#dropdown_title").html(selText);
            
    //         USER_YEAR = selText;
    //        // timer();
    //     });

        

    // d3v3.select("#button").on("click", function(d) {
    //     if (USER_YEAR == "usa") {
    //         USER_YEAR = "Australia";
    //     } else {
    //         USER_YEAR = "Paraguay";
    //     }
    //     console.log(USER_YEAR);
    //
    //     timer();
    // })
        
    // svgGooey.on("mousemove", function() {
    //     var p1 = d3v3.mouse(this);
        
    //     //console.log( d3v3.event.pageX, d3v3.event.pageY ) // log the mouse x,y position
        
    //     root.px = p1[0];
    //     root.py = p1[1];
    //     force.resume();
    //   });

    // Run function periodically to make things move.

    var timeout;
    function timer() {
      nodes_so_far = 1;
      d3v3.keys(year_data[USER_YEAR]).forEach(function(c) {
        if (year_data[USER_YEAR][c] > 0) {
          d3v3.range(0, year_data[USER_YEAR][c]).map(function(o, i) {
            if (nodes_so_far <= 100) {
              nodes[nodes_so_far].choice = c;
              nodes_so_far += 1;
            }
          });
        }
      });
    
      force.resume();
  
      d3v3.selectAll("text.counter")
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
          } 

          else {
            var just_number = 0;
          }
  
          var choice = d3v3.select(this).attr("data-choice");
          var new_pct = year_data[USER_YEAR][choice];
          //console.log(choice);
      
          var i = d3v3.interpolate(just_number, new_pct);
          return function(t) {
            if (i(t) < 1 && i(t) > 0) {
                this.textContent = "<1%";
            }
            else {
              this.textContent = Math.round(i(t)) + "%";
            }
          }
        });
    
        // Run it again in a few seconds.
         timeout = setTimeout(timer, 400);
    }



    //
    // Force-directed boiler plate functions
    //


    function tick(e) {
      circle
      .each(gravity(.11 * e.alpha))
        .each(collide(.75))
        .style("fill", function(d) { return foci[d.choice].color; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
        force.resume();
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
      var quadtree = d3v3.geom.quadtree(nodes);
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
   // cells = cells_orig;
} // @end d3v3.tsv()








function type(d, i) {
  
  d3v3.keys(d).map(function(key) {
    if (key != "country") {
        d[key] = +d[key];
    }
  });
  return d;

}