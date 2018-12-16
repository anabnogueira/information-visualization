const format = d3.format(',');




// Set tooltips
const tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(d => `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>Mortality Rate: </strong><span class='details'>${format(d.population)}</span>`);

const margin_map = {top: 0, right: 0, bottom: 0, left: 0};
const width_map = 500;
const height_map = 400;



// const colors = ['rgb(204, 0, 153)', 
//           'rgb(255, 80, 80)', 
//           'rgb(255, 153, 51)', 
//           'rgb(51, 51, 255)', 
//           'rgb(0, 204, 153)', 
//           'rgb(204, 102, 255)', 
//           'rgb(255, 0, 102)',
//           'rgb(51, 204, 51)',
//           'rgb(0, 255, 204)',
//           'rgb(230, 153, 0)'];

const svg_map = d3.select('#worldmap')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '76%')
  //.style('border', '1px solid white')
  .style('padding-left', '8vh')
  .style('margin-top', '1vh')
  .append('g')
  .attr('class', 'map');

const projection = d3.geoRobinson()
  .scale(105)
  .rotate([352, 0, 0])
  .translate( [width_map / 2, height_map / 2]);

const path = d3.geoPath().projection(projection);

svg_map.call(tip);

// Data and color scale
var data = d3.map();
var colorScheme = ['#b3b3cc', '#ffffff', '#b3d1ff', '#66b3ff', '#1a8cff', '#0059b3', '#004080', '#00264d'];
//var colorScheme =d3.schemeBlues[8];
//colorScheme.unshift("#ddd")
var colorScale = d3.scaleThreshold()
                  .domain([1, 5, 7, 10, 13, 16, 23])
                  .range(colorScheme);


// Legend
var g = svg_map.append("g")
            .attr("class", "legendThreshold")
            .attr("transform", "translate(560,0)");
g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Mortality values");
var labels = ['0', '1-4','5-6', '7-9', '10-12', '13-15','16-22','> 23'];
var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
svg_map.select(".legendThreshold")
    .call(legend);





// *****************  SLIDER TO SELECT CURRENT YEAR *************

/*current_year = 1990;*/


var filename_template = "mortality_rate_sorted";
var filename = "";

queue()
  .defer(d3.json, 'world_countries.json')
  .defer(d3.tsv, filename_template + "1990.tsv")
  .await(ready);



$( function() {
  $( "#slider-range-max" ).slider({
    range: "max",
    min: 1990,
    max: 2015,
    value: $( "#current_year" ).val(),
    slide: function( event, ui ) {
      $( "#current_year" ).val(ui.value);
      current_year = $( "#slider-range-max" ).slider( "value" );
      changeWorldMap();
      
    }

  });

});



function changeWorldMap(){
  
  if (1990 <= current_year && current_year <= 1994) {
    filename = filename_template + "1990.tsv";

  }

  if (1995 <= current_year && current_year <= 1999) {
    filename = filename_template + "1995.tsv";

  }

  if (2000 <= current_year && current_year <= 2004) {
    filename = filename_template + "2000.tsv";

  }

  if (2005 <= current_year && current_year <= 2009) {
    filename = filename_template + "2005.tsv";

  }

  if (2010 <= current_year && current_year <= 2015) {
    filename = filename_template + "2010.tsv";

  }


  queue()
      .defer(d3.json, 'world_countries.json')
      .defer(d3.tsv, filename)
      .await(ready);
}


function ready(error, data, population) {


  const populationById = {};

  population.forEach(d => { populationById[d.id] = +d.population; });
  data.features.forEach(d => { d.population = populationById[d.id] });

  svg_map.append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(data.features)
    .enter().append("path")
            .attr("fill", function (d){
                // Pull data for this country
                d.total = populationById[d.id] || 0;
                // Set the color
                return colorScale(d.total);
            })
      .attr('d', path)
      .style('stroke', 'white')
      .style('opacity', 0.8)
      .style('stroke-width', 0.3)
      // tooltips
      .on('mouseover',function(d){
        tip.show(d);
        d3.select(this)
          .style('opacity', 1)
          .style('stroke-width', 3)
          .html(d => d)
          .on("click", function(d){
            /*   d3.select(this)
                .style("stroke", "bisque")
                .style("stroke-width", "2.5") */
            if(countriesSelected.includes(d.properties.name)){
              return;
            }  
            

            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/

            if (d.population == null) {

                return;
              }
            else {
              var sc = document.getElementById("selectedCountry")
              //var hue = colors[Math.floor(Math.random()*colors.length)];;
              var j = d.properties.name;

              sc.innerHTML += "<li>"+ d.properties.name + "<span class=" + "close" + ">" + "&times;"+ "</span>" + "<span class=" + "coloring" +">" + "</span>"+ "</li>"; 
              var closebtns = document.getElementsByClassName("close");
              var i;

              for (i = 0; i < closebtns.length; i++) {
                closebtns[i].addEventListener("click", function() {
                  this.parentElement.style.display = 'none';
                  s = this.parentElement.firstChild.data;
                  countriesSelected.splice(countriesSelected.indexOf(s), 1);
                  $(document).trigger('countriesSelected', {countriesSelected});
                  countries.push(s);   
                });
              }


              countriesSelected.push(d.properties.name);
              $(document).trigger('countriesSelected', {countriesSelected});
              countries.splice(countries.indexOf(d.properties.name), 1);
            }




          });
      })
      .on('mouseout', function(d){
        tip.hide(d);
        d3.select(this)
          .style('opacity', 0.8)
          .style('stroke-width',0.3);
      });

  svg_map.append('path')
    .datum(topojson.mesh(data.features, (a, b) => a.id !== b.id))
    .attr('class', 'names')
    .attr('d', path);
}

function decide_color(){
  
}