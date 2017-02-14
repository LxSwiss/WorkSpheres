

Markers = new Mongo.Collection('markers');
let paris = {lat: 48.864716, lng: 2.349014};
let diderot = {lat: 48.492819, lng: 2.223059};
let kremlin = {lat: 48.81471, lng: 2.36073};
let touchplace = {lat: 48.87397066741686, lng: 2.396054267701402};

// LatLng from Arrondisements in Paris
let arr1= {lat: 48.8592, lng: 2.3417};
let arr2= {lat: 48.8655, lng: 2.3426};
let arr3= {lat: 48.8637, lng: 2.3615};
let arr4= {lat: 48.8601, lng: 2.3507};
let arr5= {lat: 48.8448, lng: 2.3471};
let arr6= {lat: 48.8493, lng: 2.33};
let arr7= {lat: 48.8565, lng: 2.321};
let arr8= {lat: 48.8763, lng: 2.3183};
let arr9= {lat: 48.8718, lng: 2.3399};
let arr10= {lat: 48.8709, lng: 2.3561};
let arr11= {lat: 48.8574, lng: 2.3795};
let arr12= {lat: 48.8412, lng: 2.3876};
let arr13= {lat: 48.8322, lng: 2.3561};
let arr14= {lat: 48.8331, lng: 2.3264};
let arr15= {lat: 48.8412, lng: 2.3003};
let arr16= {lat: 48.8637, lng: 2.2769};
let arr17= {lat: 48.8835, lng: 2.3219};
let arr18= {lat: 48.8925, lng: 2.3444};
let arr19= {lat: 48.8817, lng: 2.3822};
let arr20= {lat: 48.8646, lng: 2.3984};





let infowindow;




Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
    infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(map.instance, 'click', function(event) {
        //Meteor.call("checkPlacesNearby", function(error, results) {
        //console.log(results.content); //results.data should be a JSON object
        //});
      //Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      touchplace = {lat: event.latLng.lat(), lng: event.latLng.lng() };
      console.log(touchplace);
    });

    


      // Specify location, radius and place types for your Places API search.
    let request = {
        location: paris,
        radius: '1000',
        types: ['library','cafe','university'],
        rankby: google.maps.places.RankBy.PROMINENCE
      };


  // Create the PlaceService and send the request.
  // Handle the callback with an anonymous function.
    
    var service = new google.maps.places.PlacesService(map.instance);
    service.nearbySearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];

            // If the request succeeds, insert the marker into the database
            // upsert only inserts if place.id doesnt exist yet

            Markers.upsert(
            
              //selector
              place.place_id
            , {  
              //Modifier
              $set: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                name: place.name,
                place_id: place.place_id
              }
            });
          }
        }
      });



    var markers = {};


    Markers.find().observe({
      added: function (document) {
        //console.log( new google.maps.LatLng(document.lat, document.lng));
        var marker = new google.maps.Marker({
          //animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,
          place_id: document.place_id,
          name: document.name
          //icon: document.icon
        });

        //google.maps.event.addListener(marker, 'dragend', function(event) {
        //  Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
        //});
        let place_info;
        google.maps.event.addListener(marker, 'click', function(){
          console.log(marker.place_id);
          infowindow.setContent("");
          service.getDetails({
            placeId: marker.place_id
          }, function(place, status){
            if (status === google.maps.places.PlacesServiceStatus.OK){
              console.log(place);
              place_info= place;
              infowindow.setContent(
            "<h2>"+place_info.name+"  </h2>"
            +"<p>"+ place_info.formatted_address+ "</p>"
            +"<a href='"+place_info.website+"'> Open Website </a>"
            );
            }
          })
          
          infowindow.open(map, this);

          
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
        zoom: 12
      };
    }
  }
});
