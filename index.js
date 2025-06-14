var map = L.map('map').setView([57.708870, 11.974560], 8);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

  map.on('click', function(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    document.getElementById("lat").innerText = "Latitud: " + lat;
    document.getElementById("lng").innerText = "Longitud:" + lng; 
<<<<<<< HEAD
});
=======
  });

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

  document.getElementById("tilt-angle").innerText = `Recommended tilt angle for ${season}: ${tilt.toFixed(1)}°`;
}

>>>>>>> 5b9ebf749594a90ff9cccbd7f53fd98a73262a9b
