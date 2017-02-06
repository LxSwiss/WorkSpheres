

Markers = new Mongo.Collection('markers');

Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
    google.maps.event.addListener(map.instance, 'click', function(event) {
      //Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
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
      return {
        center: new google.maps.LatLng(48.864716, 2.349014),
        zoom: 12
      };
    }
  }
});
