var map = L.map('map').setView([57.708870, 11.974560], 8);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

  map.on('click', function(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    document.getElementById("lat").innerText = "Latitud: \n" + lat;
    document.getElementById("lng").innerText = "Longitud: \n" + lng; 

    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng]).addTo(map);
    }
    
});

var marker;

function geocode() {
  var address = document.getElementById('address').value;

  fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(address))
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        var lat = data[0].lat;
        var lng = data[0].lon;

        document.getElementById("lat").innerText = "Latitud: \n" + lat;
        document.getElementById("lng").innerText = "Longitud: \n" + lng; 

        // Move map to result
        map.setView([lat, lng], 14);

        // Place or move marker
        if (marker) {
          marker.setLatLng([lat, lng]);
        } 
        else {
            marker = L.marker([lat, lng]).addTo(map);
        }
        }
        else {
          alert("Address not found");
        }
      })
      .catch(error => {
        alert("Geocoding error: " + error);
      });
  }

// Press enter to search
const inputaddress = document.getElementById("address");

inputaddress.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission if needed
    document.getElementById("search").click(); // Simulate button click
  }
});

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
  document.getElementById("lat").innerText = "Latitud: \n" + position.coords.latitude;
  document.getElementById("lng").innerText = "Longitud: \n" + position.coords.longitude; 
  if (marker) {
    marker.setLatLng([position.coords.latitude, position.coords.longitude]);
  } 
  else 
  {
    marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
  }
}

// Dark/light Mode
const lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
});

const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap contributors, © CartoDB'
});

lightTiles.addTo(map);

const toggleButton = document.getElementById('toggle-theme');

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  if (document.body.classList.contains('dark-mode')) {
    map.removeLayer(lightTiles);
    darkTiles.addTo(map);
  } else {
    map.removeLayer(darkTiles);
    lightTiles.addTo(map);
  }
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
    case "fall":
      tilt = latitude;
    default:
      tilt = 0.76 * latitude + 3.1
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

  const area = parseFloat(document.getElementById("panelArea").value);
  const efficiency = parseFloat(document.getElementById("panelEfficiency").value);

  if (isNaN(area) || isNaN(efficiency) || area <= 0 || efficiency <= 0) {
    alert("Please enter valid panel area and efficiency.");
    return;
  }

  const tilt = calculateTiltAngle(Math.abs(latitude), season);
  const direction = getPanelDirection(latitude);

  document.getElementById("tilt-angle").innerText = `Recommended tilt angle for ${season}: ${tilt.toFixed(1)}°\nPanel should face: ${direction}`;

  const outputData = simulateOutputByTilt(latitude, area, efficiency);
  const labels = outputData.map(item => item.tilt);
  const data = outputData.map(item => item.output);
  const irradiance = [
  0.2, 0.15, 0.1, 0.1, 0.1, 0.2,
  0.4, 0.6, 0.7, 0.8, 0.9, 1.0,
  1.2, 1.1, 1.0, 0.9, 0.8, 0.7,
  0.6, 0.5, 0.4, 0.3, 0.2, 0.1
];


  drawTiltchart(labels, data);
  drawDailyProductionChart(irradiance);
};

function getPanelDirection(latitude) {
  return latitude >= 0 ? "South" : "North";
}


function simulateOutputByTilt(latitude, area, efficiency) {
  const results = [];
  const optimalTilt = 0.76 * latitude + 3.1;
  const panelPowerKW = (area * efficiency) / 1000; // convert to kW
  const averageSunHoursPerYear = latitude >= 0 ? 1100 : 900;

  for (let tilt = 0; tilt <= 90; tilt += 5) {
    const efficiencyFactor = Math.cos((Math.PI / 180) * (tilt - optimalTilt));
    const normalized = Math.max(0, efficiencyFactor);
    const output = panelPowerKW * averageSunHoursPerYear * normalized;
    results.push({ tilt, output: output.toFixed(0) });
  }

  return results;
}

function error() {
  alert("Sorry, no position available.");
}