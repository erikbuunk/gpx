/**
* Parser is aangepaste versie van
  https://github.com/peplin/gpxviewer
*/
function GPXParser(xmlDoc, map) {
  this.xmlDoc = xmlDoc;
  this.map = map;
  this.trackcolour = "#ff00ff"; // red
  this.trackwidth = 5;
  this.mintrackpointdelta = 0.0000001;

  this.myIcon = L.icon({
    iconUrl: 'img/marker.png',
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -16],
    // shadowUrl: 'my-icon-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
  });

}

// Set the colour of the track line segements.
GPXParser.prototype.setTrackColour = function (colour) {
  this.trackcolour = colour;
}

// Set the width of the track line segements
GPXParser.prototype.setTrackWidth = function (width) {
  this.trackwidth = width;
}

// Set the minimum distance between trackpoints.
// Used to cull unneeded trackpoints from map.
GPXParser.prototype.setMinTrackPointDelta = function (delta) {
  this.mintrackpointdelta = delta;
}

GPXParser.prototype.translateName = function (name) {
  if (name == "wpt") {
    return "Waypoint";
  } else if (name == "trkpt") {
    return "Track Point";
  } else if (name == "rtept") {
    return "Route Point";
  }
}


GPXParser.prototype.createMarker = function (point) {
  var lon = parseFloat(point.getAttribute("lon"));
  var lat = parseFloat(point.getAttribute("lat"));
  var html = "";

  // TODO: mooiere manier van opmaak van de tekst (bij NS wandelingen)
  var pointElements = point.getElementsByTagName("html");
  if (pointElements.length > 0) {
    for (i = 0; i < pointElements.item(0).childNodes.length; i++) {
      html += pointElements.item(0).childNodes[i].nodeValue;
    }
  } else {
    // Create the html if it does not exist in the point.
    html = "<b>" + this.translateName(point.nodeName) + "</b><br>";
    var attributes = point.attributes;
    var attrlen = attributes.length;
    for (i = 0; i < attrlen; i++) {
      html += attributes.item(i).name + " = " +
        attributes.item(i).nodeValue + "<br>";
    }

    if (point.hasChildNodes) {
      var children = point.childNodes;
      var childrenlen = children.length;
      for (i = 0; i < childrenlen; i++) {
        // Ignore empty nodes
        if (children[i].nodeType != 1) continue;
        if (children[i].firstChild == null) continue;
        html += children[i].nodeName + " = " +
          children[i].firstChild.nodeValue + "<br>";
      }
    }
  }

  var marker = L.marker([lat, lon], {
    icon: this.myIcon
  }).addTo(map);
  marker.bindPopup(html);

}

GPXParser.prototype.addTrackSegmentToMap = function (trackSegment, colour,
  width) {
  var trackpoints = trackSegment.getElementsByTagName("trkpt");

    if (trackpoints.length == 0) {
    return;
  }

  var pointarray = [];

  // process first point
  var lastlon = parseFloat(trackpoints[0].getAttribute("lon"));
  var lastlat = parseFloat(trackpoints[0].getAttribute("lat"));

  var latlng = [lastlat, lastlon];

  pointarray.push(latlng);

  for (var i = 1; i < trackpoints.length; i++) {
    var lon = parseFloat(trackpoints[i].getAttribute("lon"));
    var lat = parseFloat(trackpoints[i].getAttribute("lat"));
    latlng = [lat, lon];
    pointarray.push(latlng);
  }

  //add point to polyline and add to maps
  var polyline = L.polyline(pointarray, {
    color: colour,
    weight: width
  }).addTo(this.map);
  // zoom the map to the polyline


}

GPXParser.prototype.addTrackToMap = function (track, colour, width) {
  var segments = track.getElementsByTagName("trkseg");

  for (var i = 0; i < segments.length; i++) {
    var segmentlatlngbounds = this.addTrackSegmentToMap(segments[i], colour,
      width);
    }
  }

  GPXParser.prototype.addRouteToMap = function (route, colour, width) {
    var routepoints = route.getElementsByTagName("rtept");

  if (routepoints.length == 0) {
    return;
  }

  var pointarray = [];

  // process first point
  var lastlon = parseFloat(routepoints[0].getAttribute("lon"));
  var lastlat = parseFloat(routepoints[0].getAttribute("lat"));
  latlng = [lastlat, lastlon];
  pointarray.push(latlng);

  for (var i = 1; i < routepoints.length; i++) {
    var lon = parseFloat(routepoints[i].getAttribute("lon"));
    var lat = parseFloat(routepoints[i].getAttribute("lat"));
    latlng = [lat, lon];
    pointarray.push(latlng);
  }


  var polyline = L.polyline(pointarray, {
    color: colour,
    weight: width
  }).addTo(this.map);

}

GPXParser.prototype.centerAndZoom = function (trackSegment) {

  var pointlist = new Array("trkpt", "rtept", "wpt");
  var minlat = 0;
  var maxlat = 0;
  var minlon = 0;
  var maxlon = 0;

  for (var pointtype = 0; pointtype < pointlist.length; pointtype++) {

    // Center the map and zoom on the given segment.
    var trackpoints = trackSegment.getElementsByTagName(
      pointlist[pointtype]);

    // If the min and max are uninitialized then initialize them.
    if ((trackpoints.length > 0) && (minlat == maxlat) && (minlat == 0)) {
      minlat = parseFloat(trackpoints[0].getAttribute("lat"));
      maxlat = parseFloat(trackpoints[0].getAttribute("lat"));
      minlon = parseFloat(trackpoints[0].getAttribute("lon"));
      maxlon = parseFloat(trackpoints[0].getAttribute("lon"));
    }

    for (var i = 0; i < trackpoints.length; i++) {
      var lon = parseFloat(trackpoints[i].getAttribute("lon"));
      var lat = parseFloat(trackpoints[i].getAttribute("lat"));

      if (lon < minlon) minlon = lon;
      if (lon > maxlon) maxlon = lon;
      if (lat < minlat) minlat = lat;
      if (lat > maxlat) maxlat = lat;
    }
  }

  if ((minlat == maxlat) && (minlat == 0)) {
    map.setView([51.505, 5.1404298], 13);
    return;
  }

  // Center around the middle of the points
  // var centerlon = (maxlon + minlon) / 2;
  // var centerlat = (maxlat + minlat) / 2;

  this.map.fitBounds([
    [minlat, minlon],
    [maxlat, maxlon]
  ]);

  //TODO: center map and fit
  // var bounds = new google.maps.LatLngBounds(
  //         new google.maps.LatLng(minlat, minlon),
  //         new google.maps.LatLng(maxlat, maxlon));
  // this.map.setCenter(new google.maps.LatLng(centerlat, centerlon));
  // this.map.fitBounds(bounds);
}

GPXParser.prototype.centerAndZoomToLatLngBounds = function (latlngboundsarray) {

  // TODO: get bounds
  // var boundingbox = new google.maps.LatLngBounds();
  for (var i = 0; i < latlngboundsarray.length; i++) {
    if (!latlngboundsarray[i].isEmpty()) {
      boundingbox.extend(latlngboundsarray[i].getSouthWest());
      boundingbox.extend(latlngboundsarray[i].getNorthEast());
    }
  }

  var centerlat = (boundingbox.getNorthEast().lat() +
    boundingbox.getSouthWest().lat()) / 2;
  var centerlng = (boundingbox.getNorthEast().lng() +
    boundingbox.getSouthWest().lng()) / 2;
  //TODO: setcenter
  // this.map.setCenter(new google.maps.LatLng(centerlat, centerlng),
  //         this.map.getBoundsZoomLevel(boundingbox));
}

GPXParser.prototype.addTrackpointsToMap = function () {
  var tracks = this.xmlDoc.documentElement.getElementsByTagName("trk");

  for (var i = 0; i < tracks.length; i++) {
    this.addTrackToMap(tracks[i], this.trackcolour, this.trackwidth);
  }
}

GPXParser.prototype.addWaypointsToMap = function () {
  var waypoints = this.xmlDoc.documentElement.getElementsByTagName("wpt");

  for (var i = 0; i < waypoints.length; i++) {
    this.createMarker(waypoints[i]);
  }
}

GPXParser.prototype.addRoutepointsToMap = function () {
  var routes = this.xmlDoc.documentElement.getElementsByTagName("rte");

  for (var i = 0; i < routes.length; i++) {
    this.addRouteToMap(routes[i], this.trackcolour, this.trackwidth);
  }
}