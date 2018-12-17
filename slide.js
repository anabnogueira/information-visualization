// *****************  SLIDER TO SELECT CURRENT YEAR *************

current_year = 1990;


var filename_template = "mortality_rate_sorted";
var filename = filename_template + "1990.tsv";

$( function() {
  $( "#slider-range-max" ).slider({
    range: "max",
    min: 1990,
    max: 2015,
    value: 2015,
    slide: function( event, ui ) {
      $( "#current_year" ).val( ui.value);
      current_year = $( "#slider-range-max" ).slider( "value" ) ;

      


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

  });

} );


 

 