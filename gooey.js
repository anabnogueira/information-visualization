var DATA_FILE_LOC = '/datasets/factors/sanitation.tsv';
var USER_YEAR = '2015'; // default user year


var maxGooey=18;
var mulGooey=50;
var file = "sanitation";
var valueGooey;

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


var defs = svgGooey.append("defs");
var filter = defs.append("filter").attr("id","gooeyCodeFilter");
filter.append("feGaussianBlur")
  .attr("in","SourceGraphic")
  .attr("stdDeviation","10")

  .attr("color-interpolation-filters","sRGB") 
  .attr("result","blur");

filter.append("feColorMatrix")
  .attr("in","blur")
  .attr("mode","matrix")
  .attr("values","1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7")
  .attr("result","gooey");

var color1 = "#ff8000";
var foci = {
    "dragger": { x: 0, y: 0, color: color1 }
};

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
    changeWorldMap3(current_year);
    drawGooey(countriesSelected);
    drawRadarAfterUpdate(current_year, countriesSelected);
    
	  }
  
	});
  
  });

  function changeWorldMap3(yr){
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



var gooeyData;
d3v3.tsv(DATA_FILE_LOC, type, function(error, info) {
  if (error) throw error;

  gooeyData = info;
});


var circleWrapper = svgGooey.append("g")
  .attr("class", "circleWrapper")
  .style("filter", "url(#gooeyCodeFilter)");

$(document).on('countriesSelected', function(e, args) {
    const { countriesSelected } = args;
    drawGooey(countriesSelected);
})


function gooey_switch(args){

  DATA_FILE_LOC = "/datasets/factors/" +args + ".tsv";

  if(args=="sanitation"){
    file="sanitation";
    mulGooey=50;
    maxGooey=12.18245;
  }
  if(args=="calories"){
    file="calories";
    mulGooey = 30;
    maxGooey=3828;
  }
  if(args=="daily_smoking"){
    file= "daily_smoking";
    mulGooey = 30;
    maxGooey=50.6;
  }
  if(args=="vaccination"){
    file="vaccination";
    mulGooey = 30;
    maxGooey= 0.03275;
  }
  if(args=="gdp"){
    file= "gdp";
    mulGooey = 31;
    maxGooey=18120714000000;
  }
  if(args=="hdi"){
    file= "hdi";
    mulGooey = 10;
    constGooey=10; 
  }
  if(args=="co2_emissions"){
    file= "co2_emissions";
    mulGooey = 15;
    maxGooey=10283.51;
  }

  d3v3.tsv(DATA_FILE_LOC, type, function(error, info) {
    gooeyData = [];
    gooeyData = info;
    drawGooey(countriesSelected);
  });

}

const svgLabels = svgGooey.append("g").attr("class", "labels-container");


function drawGooey(countriesSelected) {
  gooeyData.forEach(function(d) {
        year_data[d.year] = d;
  });

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
          x : Math.floor(Math.random() * (550 - 100)) + 100,
          y : Math.floor(Math.random() * (300 - 100)) + 100,
          color: col
        };  
      }

      if(file=="sanitation"){
        valueGooey = Math.sqrt(year_data[USER_YEAR][str] *100)*1.3;

      }
      if(file=="calories"){
        valueGooey = year_data[USER_YEAR][str]/maxGooey * 17;
      }
      if(file=="daily_smoking"){
        valueGooey= year_data[USER_YEAR][str]/1.5;
      }
      if(file=="vaccination"){
        valueGooey= 1300* year_data[USER_YEAR][str]/ maxGooey;
      }
      if(file=="gdp"){
        //valueGooey =  mulGooey*year_data[USER_YEAR][str]/ maxGooey;
         valueGooey =  (year_data[USER_YEAR][str] * 0.0000000001)/1.5;
      }
      if(file=="hdi"){
        valueGooey = Math.exp(year_data[USER_YEAR][str]*3);
      }
      if(file=="co2_emissions"){
        //valueGooey =  11*year_data[USER_YEAR][str]/ maxGooey;
        valueGooey = Math.sqrt(year_data[USER_YEAR][str] *10)*0.6;
      }


      d3v3.range(0, valueGooey).map(function(o, i) {

        nodes_so_far += 1;

          nodes.push({
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


  var force = d3v3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    .friction(.93)
    .on("tick", tick)
    .start();


svgGooey.on("mousemove", function() {
  var p1 = d3v3.mouse(this);

  
  root.px = p1[0];
  root.py = p1[1];
  force.resume();
});
  
  var circleData = circleWrapper.selectAll("circle")
    .data(nodes, function(d) {
      return d.idd;
  });


  circleData.exit().remove();

  var circle = circleData.enter().append("circle")
    .attr("id", function(d) { return d.idd; })
    .attr("class", "node")
    .style("fill", function(d) { return foci[d.choice].color; });    

  circle.transition()
    .duration(900)
    .delay(function(d,i) { return i * 5; })
    .attrTween("r", function(d) {
      var i = d3v3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });

    let dataCountries = countriesSelected.map((c) => {
      return {country: c, id: c + file + USER_YEAR};
    });
    
    const svgLabelsData = svgLabels.selectAll('text').data(dataCountries, function(d) {
      return d.id;
    });

    svgLabelsData.exit().remove();
    
    svgLabelsData.enter().append("text")
          .attr("class", "counter")
          .attr("data-choice", function(d) {
            return d.country;
          })
          .attr("x", function(d) {
            return foci[d.country].x;
          })
          .attr("y",  function(d) {
            return foci[d.country].y;
          })
          .style("font-weight", "lighter")
          .style("font-family", "sans serif")
          .text(function(d) {
            return year_data[USER_YEAR][d.country];
          })


    function tick(e) {
      circle
      .each(gravity(.11 * e.alpha))
        .each(collide(.75))
        .style("fill", function(d) { return foci[d.choice].color; })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
        force.resume();
    }


    function gravity(alpha) {
      return function(d) {
        d.y += (foci[d.choice].y - d.y) * alpha;
        d.x += (foci[d.choice].x - d.x) * alpha;
      };
    }


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
}

function type(d, i) {
  
  d3v3.keys(d).map(function(key) {
    if (key != "country") {
        d[key] = +d[key];
    }
  });
  return d;

}
