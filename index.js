var map = L.map('map').setView([57.708870, 11.974560], 8);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

  map.on('click', function(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    document.getElementById("lat").innerText = "Latitud: " + lat;
    document.getElementById("lng").innerText = "Longitud:" + lng; 
});