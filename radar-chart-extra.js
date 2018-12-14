//	* * * * * * * * * * * * * * * * * * * * * * * * * * * *
//	DATA SCRIPT FOR RADAR CHART
//	* * * * * * * * * * * * * * * * * * * * * * * * * * * *




var w = 250,
	h = 250;

//var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['Smartphone','Tablet'];


var countriesAlreadySelected;
var selectedYear = "2015";
countriesAlreadySelected = ["Portugal"];
//var selectedCountry = "Portugal";

var dataToLoad = "/datasets/causes" + selectedYear + ".csv";

var radarData;

d3v3.csv(dataToLoad, function(data) {
	//console.log(data);
	radarData = data;
});


var country_data = {};
var e = [];

$(document).on('countriesSelected', function(e, args) {
	const { countriesSelected } = args;
	drawRadar(countriesSelected);
	console.log("CAPTEI O CLICK");
})


function drawRadar(countriesSelected){
	//var e = [];
	var c = [];
	radarData.forEach(function(d) {
		//console.log(d.Country);

		for (var i = 0; i < countriesSelected.length; i++) {
			if(d.Country == countriesSelected[i]){
				// console.log("OLAAAAA");
				// console.log(String(d.cause));
				// console.log(d.percentage);
				c.push({
					axis: d.cause,
					value: +d.percentage 
				});
			}
			//e += c;

			//console.log(e);
		}
		
});
	//console.log(c);
	e.push(c);
//console.log(e);
//console.log("FIM");

	/*
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
	],[
		{axis:"Cancers",value:0.9},
		{axis:"Cardiovascular Diseases",value:0.6},
		{axis:"Conflict",value:0.12},
		{axis:"Dementia",value:0.34},
		{axis:"Diabetes",value:0.48},
		{axis:"HIV/AIDS",value:0.14},
		{axis:"Homicide",value:0.11},
		{axis:"Kidney Disease",value:0.05},
		{axis:"Liver Disease",value:0.07},
		{axis:"Natural Disasters",value:0.12}
		]
]; */

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
RadarChart.draw("#chart", e, mycfg);

}








