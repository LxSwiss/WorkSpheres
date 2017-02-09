

Markers = new Mongo.Collection('markers');
let paris = {lat: 48.864716, lng: 2.349014};

 // Specify location, radius and place types for your Places API search.
let request = {
    location: paris,
    radius: '5000',
    types: ['library']
  };

Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {

    google.maps.event.addListener(map.instance, 'click', function(event) {
        //Meteor.call("checkPlacesNearby", function(error, results) {
        //console.log(results.content); //results.data should be a JSON object
        //});
      //Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });


  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
    var service = new google.maps.places.PlacesService(map.instance);
    console.log(request);
    service.nearbySearch(request, function(results, status) {
      console.log("waaaaa");
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];

            // If the request succeeds, draw the place location on
            // the map as a marker, and register an event to handle a
            // click on the marker.
            var marker = new google.maps.Marker({
              map: map.instance,
              position: place.geometry.location
            });
          }
        }
      });


    var markers = {};

    Markers.find().observe({
      added: function (document) {
        var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,
          id: document._id
        });

        google.maps.event.addListener(marker, 'dragend', function(event) {
          Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
        });

        markers[document._id] = marker;
      },
      changed: function (newDocument, oldDocument) {
        markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
      },
      removed: function (oldDocument) {
        markers[oldDocument._id].setMap(null);
        google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
        delete markers[oldDocument._id];
      }
    });
  });
});

Meteor.startup(function() {
  GoogleMaps.load({
  key: 'AIzaSyDIbiOuksYAqtU2z_E1WF4aeF_ov6FvADQ',
  libraries: 'geometry,places'
});
});

Template.map.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      //paris = new google.maps.LatLng(48.864716, 2.349014)
      return {
        center: paris,
        zoom: 12,
        scrollwheel: false
      };
    }
  }
});
