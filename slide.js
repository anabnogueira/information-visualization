
  $( function() {
    $( "#slider-range-max" ).slider({
      range: "max",
      min: 1990,
      max: 2015,
      value: 1990,
      slide: function( event, ui ) {
        $( "#current_year" ).val( ui.value);
      }

    });
    $( "#current_year" ).val( $( "#slider-range-max" ).slider( "value" ) );
  } );


 

 