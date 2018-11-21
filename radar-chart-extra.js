//	* * * * * * * * * * * * * * * * * * * * * * * * * * * *
//	DATA SCRIPT FOR RADAR CHART
//	* * * * * * * * * * * * * * * * * * * * * * * * * * * *







var w = 250,
	h = 250;

//var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['Smartphone','Tablet'];

//var selectedYear = "2015";
//var selectedCountry = "Portugal";






//Data
var d = [
		  [
			{axis:"Cancers",value:0.59},
			{axis:"Cardiovascular Diseases",value:0.56},
			{axis:"Conflict",value:0.42},
			{axis:"Dementia",value:0.34},
			{axis:"Diabetes",value:0.48},
			{axis:"HIV/AIDS",value:0.14},
			{axis:"Homicide",value:0.11},
			{axis:"Kidney Disease",value:0.05},
			{axis:"Liver Disease",value:0.07},
			{axis:"Natural Disasters",value:0.12}
		  ],[
				{axis:"Cancers",value:0.5},
				{axis:"Cardiovascular Diseases",value:0.5},
				{axis:"Conflict",value:0.42},
				{axis:"Dementia",value:0.34},
				{axis:"Diabetes",value:0.02},
				{axis:"HIV/AIDS",value:0.4},
				{axis:"Homicide",value:0.18},
				{axis:"Kidney Disease",value:0.5},
				{axis:"Liver Disease",value:0.74},
				{axis:"Natural Disasters",value:0.11}
		  ]
		];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.6,
  levels: 6,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#chart", d, mycfg);
