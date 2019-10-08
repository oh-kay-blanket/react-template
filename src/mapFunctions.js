let newCoordinate = (newName,lngStart,coordinates) => {
  return new google.maps.LatLng(parseFloat(coordinates),parseFloat(coordinates.substr(lngStart)));
}

// Parse coordinates function
let parseCoordinates = (newName,coordinates) => {

  // Determine LatLng placement
  // Positive numbers
  if((coordinates.substr(0,2)) > 0) {

    // Single digit
   if(isNaN(coordinates.substr(1,1))) {
    return newCoordinate(newName,9, coordinates);

    // Double digit
    } else {
     return newCoordinate(newName,10, coordinates);
    }

  // Negative numbers
  } else {

    // Single digit
    if(isNaN(coordinates.substr(2,2))) {
      return newCoordinate(newName,10, coordinates);

    // Double digit
    } else {
      return newCoordinate(newName,11, coordinates);
    }
  };
}

let windowOffset = windowPlacement => {
  switch(windowPlacement) {
    case 'r':
      return new google.maps.Size(300,330);
    case 'l':
      return  new google.maps.Size(-300,330);
    case 't':
      return  new google.maps.Size(0,20);
    case 'b':
      return  new google.maps.Size(0,650);
  }
}

let photoCheck = trip => {
  if(trip.Photo != "") {
    return `/img/cities/${trip.Id}.jpg`;
  } else {
    return `/img/cities/wedding.jpg`;
  };
}

let makeMarker = (trip, points) => {
  return new google.maps.Marker({
    position:points[0],
		icon: '/img/plunkett-flag.png',
		color: '#786651',
		offset:windowOffset(trip.WindowPlacement),
    title:`${trip.City}`,
    Id: `${trip.Id}`,
    basicInfo:`
      <div class="map-window">
        <div><h4>${trip.Trip} </h4><p><b>&nbsp;${trip.City}</b></p></div>
        <image class="map-panel-photo" src="${photoCheck(trip)}"><br><br>
        <div>
          <p><b>${trip.From} - ${trip.To}</b></p>
        </div>`,

    description:`<div><p><b> The story:</b> ${trip.Description}</p></div></div>`,

    locations:`<div><p><b>Places visited</b>: ${trip.Locations}</p></div>`,

    people:trip.People,
    peopleInsert:`<div><p><b>People seen: </b>${trip.People}</p></div>`,
    photos:trip.PhotoAlbum,
    morePhotos: `<div><p><a href="${trip.PhotoAlbum}" target="_blank">More photos</a></p><br><br>`,
    number:trip.NumberInTrip,
    buildPath:points.slice(1)
  });
}

let infoWindowContent = marker => {
  if (marker.photos != "") {
    return marker.basicInfo + marker.morePhotos + marker.locations + marker.description;

  // Without people visited
  } else {
    return marker.basicInfo + marker.locations + marker.description;
  };
}

let makeInfoWindow = (marker, points) => {
  return new google.maps.InfoWindow({
    content: infoWindowContent(marker),
    position: points[0],
    maxWidth: 560,
    pixelOffset: marker.offset,
    Id: marker.Id,
  });
}

let clearOldWindows = activeWindow => {
  if (activeWindow) {
    return activeWindow.close();
  }
}

// Clear previous trip paths
let clearPath = tripPath => {
  if(tripPath != "") {
    tripPath.setMap(null);
  }
}

let drawPath = (marker) => {
  // Draw trip path
  if(marker.pathMarker1 != "") {
    return new google.maps.Polyline({
      path: marker.buildPath,
      strokeColor: "#786651",
      strokeOpacity: 1,
      strokeWeight: 4,
    });
  }
}

let setPath = (map, marker, tripPath) => {
  if(marker.pathMarker1 != "") {
    tripPath.setMap(map);
  }
}


let render = (mapData, map) => {
  let activeWindow = false;
  let tripPath = "";

  // Place each trip
  for (let trip of mapData) {
    let dataLocations = [trip.LatLng, trip.One, trip.Two, trip.Three, trip.Four, trip.Five, trip.Six, trip.Seven, trip.Eight, trip.Nine, trip.Ten, trip.Eleven, trip.Twelve, trip.Thirteen];
    let points = [];

    let convertLocation = (location, index) => {
      if (location !== '') {
          points.push(parseCoordinates(index,location));
        }
    }

    // Convert LatLng into Google Maps coordinates
    dataLocations.forEach(convertLocation);

    // Set markers
    let marker = makeMarker(trip, points);
    marker.setMap(map);

    // Marker click functionality & build window
    google.maps.event.addListener(marker, 'click', function() {

      // Windows
      clearOldWindows(activeWindow);
      let infowindow = makeInfoWindow(marker, points);
      infowindow.open(map, marker);
      activeWindow = infowindow;

      // Paths
      clearPath(tripPath);
      tripPath = drawPath(marker);
      setPath(map, marker, tripPath);

      // Close all windows upon map click
      google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
        clearPath(tripPath);
      });
    });
  }
}

export { render };
