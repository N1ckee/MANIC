var map = L.map('map').setView([57.708870, 11.974560], 8);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

  map.on('click', function(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    document.getElementById("lat").innerText = "Latitud: " + lat;
    document.getElementById("lng").innerText = "Longitud:" + lng; 
});


  var map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  var marker;

  function geocode() {
    var address = document.getElementById('address').value;

    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(address))
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          var lat = data[0].lat;
          var lon = data[0].lon;

          document.getElementById("lat").innerText = "Latitud: " + lat;
          document.getElementById("lng").innerText = "Longitud:" + lon; 

          // Move map to result
          map.setView([lat, lon], 13);

          // Place or move marker
          if (marker) {
            marker.setLatLng([lat, lon]);
          } else {
            marker = L.marker([lat, lon]).addTo(map);
          }
        } else {
          alert("Address not found");
        }
      })
      .catch(error => {
        alert("Geocoding error: " + error);
      });
  }


// Gets geodata from user and updates the map with it
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
   // x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function success(position) {
  map.setView([position.coords.latitude,position.coords.longitude], 14)
  document.getElementById("lat").innerText = "Latitud: " + position.coords.latitude;
  document.getElementById("lng").innerText = "Longitud:" + position.coords.longitude; 
}

function error() {
  alert("Sorry, no position available.");
}

// Function to calculate tilt angle based on latitude and season
function calculateTiltAngle(latitude, season = "average") {
  let tilt;
  switch (season.toLowerCase()) {
    case "winter":
      tilt = latitude + 15;
      break;
    case "summer":
      tilt = latitude - 15;
      break;
    case "spring":
      tilt = latitude;
    case "authumn":
      tilt = latitude;
    default:
      tilt = latitude;
  }
  return Math.max(0, Math.min(tilt, 90)); // Clamp between 0 and 90 degrees
}

// Function that runs when the user clicks the "Calculate" button
function runCalculation() {
  const latText = document.getElementById("lat").innerText;
  const latMatch = latText.match(/[-+]?[0-9]*\.?[0-9]+/); // Extract number from text
  if (!latMatch) {
    alert("Please click on the map to select a location.");
    return;
  }

  const latitude = parseFloat(latMatch[0]);
  const season = document.getElementById("season").value;
  const tilt = calculateTiltAngle(latitude, season);
  const direction = getPanelDirection(latitude);

  document.getElementById("tilt-angle").innerText = `Recommended tilt angle for ${season}: ${tilt.toFixed(1)}°\nPanel should face: ${direction}`;
};

function getPanelDirection(latitude) {
  return latitude >= 0 ? "South" : "North";
}
