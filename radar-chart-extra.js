//	* * * * * * * * * * * * * * * * * * * * * * * * * * * *
//	DATA SCRIPT FOR RADAR CHART
//	* * * * * * * * * * * * * * * * * * * * * * * * * * * *



var colorToCountries = {
	"Afghanistan": "#3957ff",
	"Albania": "#d3fe14",
	"Algeria": "#c9080a",
	"Angola": "#fec7f8",
	"Antigua and Barbuda": "#0b7b3e",
	"Argentina": "#0bf0e9",
	"Armenia": "#c203c8",
	"Australia": "#fd9b39",
	"Austria": "#888593",
	"Azerbaijan": "#906407",
	"Bahamas": "#98ba7f",
	"Bahrain": "#fe6794",
	"Bangladesh": "#10b0ff",
	"Barbados": "#ac7bff",
	"Belarus": "#fee7c0",
	"Belgium": "#964c63",
	"Belize": "#1da49c",
	"Benin": "#0ad811",
	"Bhutan": "#bbd9fd",
	"Bolivia": "#fe6cfe",
	"Bosnia and Herzegovina": "#297192",
	"Botswana": "#d1a09c",
	"Brazil": "#ffff00",
	"Brunei": "#81ffad",
	"Bulgaria": "#739400",
	"Burkina Faso": "#ca6949",
	"Burundi": "#d9bf01",
	"Cambodia":"#646a58",
	"Cameroon": "#d5097e",
	"Canada": "#bb73a9",
	"Cape Verde": "#ccf6e9",
	"Central African Republic": "#9cb4b6",
	"Chad": "#b6a7d4",
	"Chile": "#9e8c62",
	"China": "#ff0000",
	"Colombia": "#01af64",
	"Comoros": "#a71afd",
	"Congo": "#cfe589",
	"Costa Rica": "#d4ccd1",
	"Côte d'Ivoire": "#fd4109",
	"Croatia": "#bf8f0e",
	"Cuba": "#2f786e",
	"Cyprus": "#4ed1a5",
	"Czech Republic": "#d8bb7d",
	"Democratic Republic of Congo": "#a54509",
	"Denmark": "#6a9276",
	"Djibouti": "#a4777a",
	"Dominican Republic": "#fc12c9",
	"Ecuador": "#606f15",
	"Egypt": "#3cc4d9",
	"El Salvador": "#f31c4e",
	"Eritrea": "#73616f",
	"Estonia": "#f097c6",
	"Ethiopia": "#fc8772",
	"Fiji": "#92a6fe",
	"Finland": "#875b44",
	"France": "#699ab3",
	"Gabon": "#94bc19",
	"Gambia": "#7d5bf0",
	"Georgia": "#d24dfe",
	"Germany": "#c85b74",
	"Ghana": "#68ff57",
	"Greece": "#b62347",
	"Grenada": "#994b91",
	"Guam": "#646b8c",
	"Guatemala": "#977ab4",
	"Guinea": "#d694fd",
	"Guinea-Bissau": "#c4d5b5",
	"Guyana": "#fdc4bd",
	"Haiti": "#1cae05",
	"Honduras": "#7bd972",
	"Hungary": "#e9700a",
	"Iceland": "#d08f5d",
	"India": "#99ff66",
	"Indonesia": "#fde945",
	"Iran": "#a29d98",
	"Iraq": "#1682fb",
	"Ireland": "#9ad9e0",
	"Israel": "#d6cafe",
	"Italy": "#8d8328",
	"Jamaica": "#b091a7",
	"Japan": "#647579",
	"Jordan": "#1f8d11",
	"Kazakhstan": "#e7eafd",
	"Kenya": "#b9660b",
	"Kiribati": "#a4a644",
	"Kuwait": "#fec24c",
	"Kyrgyzstan": "#b1168c",
	"Laos": "#188cc1",
	"Latvia": "#7ab297",
	"Lebanon": "#4468ae",
	"Lesotho": "#c949a6",
	"Liberia": "#d48295",
	"Libya": "#eb6dc2",
	"Lithuania": "#d5b0cb",
	"Luxembourg": "#ff9ffb",
	"Macedonia": "#fdb082",
	"Madagascar": "#af4d44",
	"Malawi": "#a759c4",
	"Malaysia": "#a9e03a",
	"Maldives": "#0d906b",
	"Mali": "#9ee3bd",
	"Malta": "#5b8846",
	"Mauritania": "#0d8995",
	"Mauritius": "#f25c58",
	"Mexico": "#70ae4f",
	"Micronesia": "#847f74",
	"Moldova": "#9094bb",
	"Mongolia": "#ffe2f1",
	"Montenegro": "#a67149",
	"Morocco": "#936c8e",
	"Mozambique": "#d04907",
	"Myanmar": "#c3b8a6",
	"Namibia": "#cef8c4",
	"Nepal": "#7a9293",
	"Netherlands": "#fda2ab",
	"New Zealand": "#2ef6c5",
	"Nicaragua": "#807242",
	"Niger": "#cb94cc",
	"Nigeria": "#b6bdd0",
	"North Korea": "#b5c75d",
	"Norway": "#fde189",
	"Oman": "#b7ff80",
	"Pakistan": "#fa2d8e",
	"Panama": "#839a5f",
	"Papua New Guinea": "#28c2b5",
	"Paraguay": "#e5e9e1",
	"Peru": "#bc79d8",
	"Philippines": "#7ed8fe",
	"Poland": "#9f20c3",
	"Portugal": "#ff8000",
	"Puerto Rico": "#f511fd",
	"Qatar": "#09c959",
	"Romania": "#bcd0ce",
	"Russia": "#8685fd",
	"Rwanda": "#98fcff",
	"Saint Lucia": "#afbff9",
	"Saint Vincent and the Grenadines": "#6d69b4",
	"Samoa": "#5f99fd",
	"Sao Tome and Principe": "#aaa87e",
	"Saudi Arabia": "#b59dfb",
	"Senegal": "#5d809d",
	"Serbia": "#d9a742",
	"Seychelles": "#ac5c86",
	"Sierra Leone": "#9468d5",
	"Singapore": "#a4a2b2",
	"Slovakia": "#b1376e",
	"Slovenia": "#d43f3d",
	"Solomon Islands": "#05a9d1",
	"Somalia": "#c38375",
	"South Africa": "#24b58e",
	"South Korea": "#6eabaf",
	"Spain": "#66bf7f",
	"Sri Lanka": "#92cbbb",
	"Sudan": "#ddb1ee",
	"Suriname": "#1be895",
	"Swaziland": "#c7ecf9",
	"Sweden": "#a6baa6",
	"Switzerland": "#8045cd",
	"Syria": "#5f70f1",
	"Taiwan": "#a9d796",
	"Tajikistan": "#ce62cb",
	"Tanzania": "#0e954d",
	"Thailand": "#a97d2f",
	"Timor": "#fcb8d3",
	"Togo": "#9bfee3",
	"Tonga": "#4e8d84",
	"Trinidad and Tobago":"#fc6d3f",
	"Tunisia": "#7b9fd4",
	"Turkey": "#8c6165",
	"Turkmenistan": "#72805e",
	"Uganda": "#d53762",
	"Ukraine": "#f00a1b",
	"United Arab Emirates": "#de5c97",
	"United Kingdom": "#b3003b",
	"United States": "#fccd95",
	"United States Virgin Islands": "#ba9c57",
	"Uruguay": "#b79a82",
	"Uzbekistan": "#7c5a82",
	"Vanuatu": "#7d7ca4",
	"Venezuela": "#958ad6",
	"Vietnam": "#cd8126",
	"Yemen": "#bdb0b7",
	"Zambia": "#10e0f8",
	"Zimbabwe": "#dccc69" 
};


var clone = [];
var w = 450,
	h = 350;


//Legend titles
var LegendOptions = ['Smartphone','Tablet'];

var a = [
	[
	{axis:"Cardiovascular diseases (%)",value:0},
	{axis:"Cancers (%)",value:0},
	{axis:"Respiratory diseases (%)",value:0},
	{axis:"Diabetes (%)",value:0},
	{axis:"Dementia (%)",value:0},
	{axis:"Lower respiratory infections (%)",value:0},
	{axis:"Neonatal deaths (%)",value:0},
	{axis:"Diarrheal diseases (%)",value:0},
	{axis:"Road incidents (%)",value:0},
	{axis:"Liver disease (%)",value:0}
	]
]; 

var mycfga = {
	w: w,
	h: h,
	maxValue: 0.6,
	levels: 6,
	ExtraWidthX: 300
	}
	


RadarChart.draw("#chart", a, mycfga, []);


var countriesAlreadySelected;
var selectedYear = "2015";

var dataToLoad = "/datasets/causes" + selectedYear + ".csv";

var radarData;

d3v3.csv(dataToLoad, function(data) {
	radarData = data;
});


var country_data = {};
var e = [];
var colorstoRadar = [];
var diff = [];
var mcfg;

$(document).on('countriesSelected', function(e, args) {
	const { countriesSelected } = args;
	drawRadar(countriesSelected);
})


function drawRadar(countriesSelected){
	colorstoRadar = [];
	var c = [];

	if(countriesSelected.length >= clone.length){
		//colorstoRadar = [];
		console.log("SELECTED >= CLONE");
	//	console.log(colorstoRadar);

		clone.push(countriesSelected[countriesSelected.length -1]);

		radarData.forEach(function(d) {
				if(d.Country == countriesSelected[countriesSelected.length -1]){
					c.push({
						axis: d.cause,
						value: +d.percentage 
					});
				}
	
			
		});

	}

	
	for (var i = 0; i < countriesSelected.length; i++) {

		colorstoRadar.push(colorToCountries[countriesSelected[i]]);
	}

	e.push(c);


	function drawRadarAfterDelete (country, diff){
		c=[];

		
		radarData.forEach(function(d) {
			if(d.Country == country){
				c.push({
					axis: d.cause,
					value: +d.percentage 
				});
			}
	
			
		});
		return c;

	}

	if(countriesSelected.length < clone.length){
		
		console.log("SELECTED < CLONE");
	//	console.log(colorstoRadar);
		diff = clone.filter(x => !countriesSelected.includes(x)).concat(countriesSelected.filter(x => !clone.includes(x)));

		clone = clone.filter(x => !diff.includes(x)).concat(diff.filter(x => !clone.includes(x)));
			
		if(diff.length > 0) {
			//console.log(colorstoRadar);
			e=[];
		
			if(countriesSelected.length == 0){
				e = [ 
							[
							{axis:"Cardiovascular diseases (%)",value:0},
							{axis:"Cancers (%)",value:0},
							{axis:"Respiratory diseases (%)",value:0},
							{axis:"Diabetes (%)",value:0},
							{axis:"Dementia (%)",value:0},
							{axis:"Lower respiratory infections (%)",value:0},
							{axis:"Neonatal deaths (%)",value:0},
							{axis:"Diarrheal diseases (%)",value:0},
							{axis:"Road incidents (%)",value:0},
							{axis:"Liver disease (%)",value:0}
							]
						]; 
					
						clone=[];
						 mcfg = {
							w: w,
							h: h,
							maxValue: 0.6,
							levels: 6,
							ExtraWidthX: 300
							}
						//	colorstoRadar = [];
							diff=[];
						
						RadarChart.draw("#chart", e, mcfg, colorstoRadar);
						e=[];
					return;
			}
			colorstoRadar=[];
			for(var j=0; j < countriesSelected.length; j++){
				var draw = drawRadarAfterDelete(countriesSelected[j], diff);
				e.push(draw);
				colorstoRadar.push(colorToCountries[countriesSelected[j]]);
			}
		}

	}


var mycfg = {
w: w,
h: h,
maxValue: 0.6,
levels: 6,
ExtraWidthX: 300
}

console.log(e);
RadarChart.draw("#chart", e, mycfg, colorstoRadar);

}








