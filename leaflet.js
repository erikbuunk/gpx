// var fs = require('fs');
// var files = fs.readdirSync('/assets/');

// const gpxFiles = [
//   'beukenburg-ns-route.gpx',
//   'NS-Muiderslot.gpx',
//   'NS-StaelduinseBos.gpx',
//   'NS-TienhovensePlassen.gpx',
//   'den-haag-ns-route.gpx',
//   'utrechtse-heuvelrug-ns-route.gpx',
//   'NS-UtrBosRivierRoute.gpx'
// ];


var map = L.map('mapid').setView([51.505, -0.09], 13);
let locationMarkerAccuracy = L.circle([0, 0], {
  color: "#0077ff",
  fillColor: '',
  radius: 5,
  stroke: false,
  fillOpacity: 0.3,
}).addTo(map);

locationMarker = L.circleMarker([0, 0], {
  radius: 8,
  stroke: true,
  weight: 2,
  color: '#ffffff',
  fillColor: '#0077ff',
  fillOpacity: 1,
}).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 18,
}).addTo(map);
L.control.scale().addTo(map);


var x = document.getElementById("demo");
var myButton = document.getElementById('timerButton');
let timerOn = false;
let timer;

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function startTimer() {
  if (timerOn) {
    clearTimeout(timer);
    timerOn = false;
    myButton.innerHTML = "Start GPS";
    myButton.style = "background-color: #fff;"
  } else {
    getLocation();
    timer = setInterval(getLocation, 5000);
    timerOn = true;
    myButton.innerHTML = "Stop GPS";
    myButton.style = "background-color: #f00;"
  }

}

function centerView() {
  map.locate({
    setView: true
  });
}

function showPosition(position) {
  map.locate({
    setView: false,
    maxZoom: 16
  });

}

function onLocationFound(e) {
  var radius = e.accuracy / 2;

  // L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
  locationMarkerAccuracy.setLatLng(e.latlng);
  locationMarker.setLatLng(e.latlng);

}

function onLocationError(e) {
  alert(e.message);
}


const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('route');
// console.log(urlParams);
// console.log(myParam);

if (myParam !== null) {
  getRoute(myParam);
} else {

  console.log(files);
  files.forEach((file) => {
    getRoute(file+'.gpx');
  })
}

function getRoute(file) {
  $.ajax({
      url: 'assets/' + file,
      dataType: "xml",
      success: function(data) {
        var parser = new GPXParser(data, map);
        parser.setTrackColour("#ff0000"); // Set the track line colour
        parser.setTrackWidth(5); // Set the track line width
        parser.setMinTrackPointDelta(0.001); // Set the minimum distance between track points
        parser.centerAndZoom(data);
        parser.addTrackpointsToMap(); // Add the trackpoints
        parser.addRoutepointsToMap(); // Add the routepoints
        parser.addWaypointsToMap(); // Add the waypoints
      }
    }

  );

}
