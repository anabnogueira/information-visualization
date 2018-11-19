// DATA EXTRACTION

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
// radar chart - causes of death
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 






var mortality_notsorted;

d3.csv("datasets/mortality_not_sorted.csv", function(data) {
	mortality_notsorted = data;
});


var mortality_sorted;

d3.csv("datasets/mortality_rate_sorted.csv", function(data) {
	 mortality_sorted = data;
});








/*
var causes_csv = function()
{
    //var parse = d3.time.format("%m/%d/%Y").parse;
    d3.csv("/datasets/mortality_not_sorted.csv", function(mortality)
    {
        //mortality is an array of json objects containing the data in from the csv
        console.log("mortality:", mortality)
        data = mortality.map(function(d)
        {
            //each d is one line of the csv file represented as a json object
            console.log("d", d)
            //month = parse(d.month).getMonth();
            //console.log("month:", d.month, month)
            //we slice the dollar sign off then convert to a number with the + sign
            //slicing works like "$216".slice(1) gives you 216, 
            //you can also give it a range like "$216 asdf".slice(1,4) gives you 216
            //p = d.price
            //price = +p.slice(1)
            //console.log("price:", p, price);
            //return {"month": month, "value":price} ;
        })
        //console.log("data", data)

        //bars(data);
    })
}



causes_csv();

*/

//var dataset = d3.csv("./datasets/mortality_not_sorted.csv");
//var parsed = d3.csvParse(dataset);

/*
var dataset;

d3.csv("./datasets/causesofdeathORDERED.csv").then(function(data){
    dataset = data; 
});

console.log(dataset);

var parsed;

d3.csvParse(dataset).then(function(data){
	parsed = data;
});
console.log(parsed); */




