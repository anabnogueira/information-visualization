
var countries = ["Afghanistan","Albania","Algeria","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh",
"Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil", "Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia",
"Cameroon","Canada","Cape Verde","Central Arfrican Republic","Chad","Chile","China","Colombia", "Comorus","Congo","Costa Rica","Côte d'Ivoire","Croatia","Cuba",
"Cyprus","Czech Republic", "Democratic Republic of Congo","Denmark","Djibouti","Dominican Republic","Ecuador","Egypt","El Salvador","Eritrea","Estonia","Ethiopia",
"Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guam","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary",
"Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia",
"Lebanon","Lesotho","Liberia","Libya","Lithuania","Luxembourg","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico",
"Micronesia","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria",
"North Korea","Norway","Oman","Pakistan","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Romania","Russia",
"Rwanda","Saint Lucia", "Saint Vincent and the Grenadines","Samoa","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
"Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria",
"Taiwan","Tajikistan","Tanzania","Thailand","Timor","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates",
"United Kingdom","United States","United States Virgin Islands","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

var countriesSelected = [];

function autocomplete(inp, arr, box) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("div");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      a.style.position = 'absolute';
      a.style.width = '80%';
      a.style.left = '10%';
      a.style.left = '10%';
      a.style.zIndex = 100;
      a.style.backgroundColor = '#302f37';
      a.style.borderRadius = '0 0 2vh 2vh';
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("div");
          b.style.padding = '0.6vh';
          b.style.borderTop= '1px solid gray';
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = "";
              
             
            
              var j = this.getElementsByTagName("input")[0].value;
              box.innerHTML += "<li>"+ j + "<span class=" + "close" + ">" + "&times;"+ "</span>" + "<span class=" + "coloring" +">" + "</span>"+ "</li>";
                                                                    
              var closebtns = document.getElementsByClassName("close");
              var i;
              var s;

              for (i = 0; i < closebtns.length; i++) {
                closebtns[i].addEventListener("click", function() {
                  this.parentElement.style.display = 'none';
                  s = this.parentElement.firstChild.data;
                  countriesSelected.splice(countriesSelected.indexOf(s), 1);
                  $(document).trigger('countriesSelected', {countriesSelected});
                  countries.push(s);
                });
              }

              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              
                countriesSelected.push(this.getElementsByTagName("input")[0].value);
                $(document).trigger('countriesSelected', {countriesSelected});
                countries.splice(countries.indexOf(this.getElementsByTagName("input")[0].value), 1);
              
              
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });


  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
} 


