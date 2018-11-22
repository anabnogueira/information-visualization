const format = d3.format(',');

// Set tooltips
const tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(d => `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>Mortality Rate: </strong><span class='details'>${format(d.population)}</span>`);

const margin_map = {top: 0, right: 0, bottom: 0, left: 0};
const width_map = 480;
const height_map = 350;

const color = d3.scaleThreshold()
  .domain([
    1,
    3,
    5,
    8,
    10,
    12,
    16,
    20,
    23,
    25,
    30,
    35,
    40,
    45
  ])
  .range([
    'rgb(247,251,255)',
    'rgb(222,235,247)', 
    'rgb(198,219,239)', 
    'rgb(158,202,225)',
    'rgb(107,174,214)',
    'rgb(66,146,198)',
    'rgb(33,113,181)',
    'rgb(8,81,156)',
    'rgb(8,48,107)',
    'rgb(3,19,43)'
  ]);

const svg_map = d3.select('#worldmap')
  .append('svg')
  .attr('width', '95%')
  .attr('height', '82%')
  //.style('border', '1px solid white')
  .style('padding-left', '3vh')
  .append('g')
  .attr('class', 'map');

const projection = d3.geoRobinson()
  .scale(105)
  .rotate([352, 0, 0])
  .translate( [width_map / 2, height_map / 2]);

const path = d3.geoPath().projection(projection);

svg_map.call(tip);

queue()
  .defer(d3.json, 'world_countries.json')
  .defer(d3.tsv, 'mortality_rate_sorted1990.tsv')
  .await(ready);

function ready(error, data, population) {
  const populationById = {};

  population.forEach(d => { populationById[d.id] = +d.population; });
  data.features.forEach(d => { d.population = populationById[d.id] });

  svg_map.append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(data.features)
    .enter().append('path')
      .attr('d', path)
      .style('fill', d => color(populationById[d.id]))
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
            console.log(d.properties.name);
            var sc = document.getElementById("selectedCountry")
            var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
            sc.innerHTML += "<li>"+ d.properties.name + "<span class=" + "close" + ">" + "&times;"+ "</span>" + "<span class=" + "coloring" + " style=\"background-color:" + hue + ";\">" + "</span>"+ "</li>"; 
            var closebtns = document.getElementsByClassName("close");
              var i;

              for (i = 0; i < closebtns.length; i++) {
                closebtns[i].addEventListener("click", function() {
                  this.parentElement.style.display = 'none';
                  countries.push(j);
                });
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

/*
d3.select("worldmap")
  .html(d => `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>Mortality Rate: </strong><span class='details'>${format(d.population)}</span>`)
  .on("click", function(d){
    console.log(d.properties.name);
  }); */