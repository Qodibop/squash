var autocomplete;

function init() {
  autocomplete = new google.maps.places.Autocomplete(document.getElementById("address"));
  autocomplete.addListener("place_changed", fillInAddress);
  document.getElementById("zipcode").value = "";
  document.getElementById("tohide").style.visibility = "hidden";
}

function fillInAddress() {
  document.getElementById("zipcode").value = autocomplete.getPlace().address_components[6].long_name;
}
