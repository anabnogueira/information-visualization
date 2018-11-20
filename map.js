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
    15,
    20,
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
          .style('stroke-width', 3);
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



/*const format = d3.format(',');

// Set tooltips
const tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(d => `<strong>Country: </strong><span class='details'>${d.properties.name}<br></span><strong>Mortality Rate: </strong><span class='details'>${format(d.rate)}</span>`);

const margin_map = {top: 0, right: 0, bottom: 0, left: 0};
const width_map = 500 - margin_map.left - margin_map.right;
const height_map = 300 - margin_map.top - margin_map.bottom;

const color = d3.scaleThreshold()
  .domain([
    10000,
    100000,
    500000,
    1000000,
    5000000,
    10000000,
    50000000,
    100000000,
    500000000,
    1500000000
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
  .attr('width', width_map)
  .attr('height', height_map)
  .append('g')
  .attr('class', 'map');

const projection = d3.geoRobinson()
  .scale(148)
  .rotate([352, 0, 0])
  .translate( [width_map / 2, height_map / 2]);

const path = d3.geoPath().projection(projection);

svg_map.call(tip);

queue()
  .defer(d3.json, 'world_countries.json')
  .defer(d3.tsv, 'world_population.tsv')
  .await(ready); */

/*var mortality_sorted;

d3.csv("datasets/mortality_rate_sorted_cc.csv")
    .row(function(d) {
      return {
        name: d.name,
        rate: d.rate,
        code: d.code,
        year: d.year_span
      };
    })
    .get(function(error, rows) {
      console.log(rows);
      mortality_sorted = rows;
      ready(mortality_sorted);
    });
      */
/*
var mortality_sorted;

d3.json("datasets/mortality_rate_sorted_cc.json")
.row(function(d) {
  return {
    name: d.name,
    rate: d.rate,
    code: d.code,
    year: d.year_span
  };
  })
  .get(function(error, rows) {
  console.log(rows);
  mortality_sorted = rows;
  ready(mortality_sorted);
});

*/

/*var mort;

d3.json("datasets/mortality_rate_sorted_cc.json").then(function(data) {
    mort = data;
    ready(mort);
	
});


function ready(data) {
  const rateByCode = {};
 var y = "1990 - 1995";
 /*  var code = "MAR";
  for (i=0 ; i < data.length; i++){
    if
  } 
  data[y].forEach(d => { rateByCode[data[y].code] = data[y].rate; });
  data.features.forEach(d => { data.rate = rateByCode[data.code] });

  svg.append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(data.features)
    .enter().append('path')
      .attr('d', path)
      .style('fill', data => color(rateByCode[data.code]))
      .style('stroke', 'white')
      .style('opacity', 0.8)
      .style('stroke-width', 0.3)
      // tooltips
      .on('mouseover',function(data){
        tip.show(data);
        d3.select(this)
          .style('opacity', 1)
          .style('stroke-width', 3);
      })
      .on('mouseout', function(d){
        tip.hide(data);
        d3.select(this)
          .style('opacity', 0.8)
          .style('stroke-width',0.3);
      });

  svg.append('path')
    .datum(topojson.mesh(data.features, (a, b) => a.code !== b.code))
    .attr('class', 'names')
    .attr('d', path);
}

*/