
let map;
Markers = new Mongo.Collection('markers');
let nbsearchmarkers;
let paris = {lat: 48.864716, lng: 2.349014};
let diderot = {lat: 48.492819, lng: 2.223059};
let francmitterand = {lat: 48.826626, lng: 2.379967};
let kremlin = {lat: 48.81471, lng: 2.36073};
let arcdetriomphe = {lat: 48.873792, lng: 2.295028};
searchForNewMarkers = false;


// LatLng from Arrondissements in Paris
let arr1   = {lat: 48.8592, lng: 2.3417};
let arr2   = {lat: 48.8655, lng: 2.3426};
let arr3   = {lat: 48.8637, lng: 2.3615};
let arr4   = {lat: 48.8601, lng: 2.3507};
let arr5   = {lat: 48.8448, lng: 2.3471};
let arr6   = {lat: 48.8493, lng: 2.33};
let arr7   = {lat: 48.8565, lng: 2.321};
let arr8   = {lat: 48.8763, lng: 2.3183};
let arr9   = {lat: 48.8718, lng: 2.3399};
let arr10  = {lat: 48.8709, lng: 2.3561};
let arr11  = {lat: 48.8574, lng: 2.3795};
let arr12  = {lat: 48.8412, lng: 2.3876};
let arr13  = {lat: 48.8322, lng: 2.3561};
let arr14  = {lat: 48.8331, lng: 2.3264};
let arr15  = {lat: 48.8412, lng: 2.3003};
let arr16  = {lat: 48.8637, lng: 2.2769};
let arr17  = {lat: 48.8835, lng: 2.3219};
let arr18  = {lat: 48.8925, lng: 2.3444};
let arr19  = {lat: 48.8817, lng: 2.3822};
let arr20  = {lat: 48.8646, lng: 2.3984};

let arrondissements = [arr1,arr2,arr3,arr4,arr5,arr6,arr7,arr8,arr9,arr10,arr11,arr12,arr13,arr14,arr15,arr16,arr17,arr18,arr19,arr20, kremlin, diderot];

// styling parameters for google maps
let  styleArray = [
    {
      featureType: 'all',
      stylers: [
        { saturation: -80 }
      ]
    },{
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        { hue: '#00ffee' },
        { saturation: 50 }
      ]
    },{
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    }
  ];



let infowindow;
let infoWindow;

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }





Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map.instance);

                  // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        //infoWindow.setPosition(pos);
        //infoWindow.setContent('Location found.');
        map.instance.setCenter(pos);

        
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }


  //Show small dot instead of marker
    let measleMarkerIcon ={
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#e23131',
      fillOpacity: .9,
      scale: 3.5,
      strokeColor: '#303030',
      strokeWeight: 0.9
    };

  //Show normal marker marker
    let normalMarkerIcon ={
      url: "img/markerblueish.png", // url
      //scaledSize: new google.maps.Size(30, 40), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };





    let searchBox = new google.maps.places.SearchBox(document.getElementById('mapsearch'));
    
    google.maps.event.addListener(searchBox, 'places_changed', function(){
      let places = searchBox.getPlaces();

        var bounds = new google.maps.LatLngBounds();
        let i, place;

        for(i=0; place=places[i];i++){
          bounds.extend(place.geometry.location);
          //marker.setPosition(place.geometry.location);
        }

        map.instance.fitBounds(bounds);
        map.instance.setZoom(13);

    })

    google.maps.event.addListener(map.instance, 'click', function(event) {
        //Meteor.call("checkPlacesNearby", function(error, results) {
        //console.log(results.content); //results.data should be a JSON object
        //});
      //Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });

      infowindow.close();
    });

    google.maps.event.addListener(map.instance, 'center_changed', function(event) {
        //Meteor.call("checkPlacesNearby", function(error, results) {
        //console.log(results.content); //results.data should be a JSON object
        //});
      //Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });

      console.log("center changed!");


            //Search for places Nearby
      // Specify location, radius and place types for your Places API search.
        request = {
          location: map.instance.getCenter(),
          radius: '2000',
          types: ['library','cafe'],
          keyword: 'wifi',
          rankby: google.maps.places.RankBy.POPULARITY
        };

          // Create the PlaceService and send the request.
          // Handle the callback with an anonymous function.
        service.nearbySearch(request, function(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              var place = results[i];

              let tempmarker = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                name: place.name,
                place_id: place.place_id,
              };

                //Set directly as Marker
                console.log(place.name);
              var marker = new google.maps.Marker({
                //animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(tempmarker.lat, tempmarker.lng),
                map: map.instance,
                place_id: place.place_id,
                name: place.name
                //icon: document.icon
              });

               let place_info;

              google.maps.event.addListener(place, 'click', function(){
                map.instance.setZoom(14);
                map.instance.setCenter(marker.getPosition());
                infowindow.setContent("");

                service.getDetails({
                  placeId: marker.place_id
                }, function(place, status){
                  if (status === google.maps.places.PlacesServiceStatus.OK){
                    //score = Markers.findOne(document._id, {_id:1}).upvotes - Markers.findOne(document._id, {_id:1}).downvotes;
                    place_info= place;
                    console.log("infobox clicked:  "+place_info.name)
                    var photo_url = place_info.photos[0].getUrl({ 'maxWidth': 500, 'maxHeight': 500 });
                    

                    let infowindowcontent = "<img src='"+photo_url+"' alt='place_image' style='width:500px;height:300px;'></br>"
                  + "<h2>"+place_info.name+"  </h2>"
                  
                  
                  +"<p>"+ place_info.formatted_address+ "</p>"
                  +"<a href='"+place_info.website+"'> Open Website </a>" ;

                    infowindow.setContent(infowindowcontent);
                  }
                })
                
                infowindow.open(map, this);

                
              });


             

              /* 
              // save in Database


              Meteor.call('addMarker', tempmarker, (err, response)=>{
                if(err) {
                  Session.set('serverDataResponse', "Error:" + err.reason);
                  return;
                }
                Session.set('serverDataResponse', response);
                }); 

              */
            }
          }
        });
    });


    let request;

    // Search all markers in one place
    if(searchForNewMarkers == true ){

      for (var i = 0; i < arrondissements.length; i++){ 

        let arrondissement = arrondissements[i];
      // Specify location, radius and place types for your Places API search.
        request = {
          location: arrondissement,
          radius: '1000',
          types: ['library','cafe'],
          keyword: 'wifi',
          rankby: google.maps.places.RankBy.POPULARITY
        };

          // Create the PlaceService and send the request.
          // Handle the callback with an anonymous function.
        service.nearbySearch(request, function(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              var place = results[i];

              let tempmarker = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                    name: place.name,
                    place_id: place.place_id,
                  };

              Meteor.call('addMarker', tempmarker, (err, response)=>{
                if(err) {
                  Session.set('serverDataResponse', "Error:" + err.reason);
                  return;
                }
                Session.set('serverDataResponse', response);
                }); 
            }
          }
        });
      }    
    }




    var markers =  {};


    Markers.find().observe({
      added: function (document) {
        //define score of place
        let score = Markers.findOne(document._id, {_id:1}).upvotes - Markers.findOne(document._id, {_id:1}).downvotes;
        let markerIcon = null;
        if (score <= -1 ){
          markerIcon = measleMarkerIcon;
        }


        var marker = new google.maps.Marker({
          //animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,
          place_id: document.place_id,
          name: document.name,
          icon: markerIcon,
          //icon: document.icon
        });

        //google.maps.event.addListener(marker, 'dragend', function(event) {
        //  Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
        //});
        let place_info;
/*
        google.maps.event.addListener(marker, 'click', function(){
          infowindow.setContent("");
          service.getDetails({
            placeId: marker.place_id
          }, function(place, status){
            if (status === google.maps.places.PlacesServiceStatus.OK){
              score = Markers.findOne(document._id, {_id:1}).upvotes - Markers.findOne(document._id, {_id:1}).downvotes;
              place_info= place;
              var photo_url = place_info.photos[0].getUrl({ 'maxWidth': 500, 'maxHeight': 500 });
              

              let infowindowcontent = "<img src='"+photo_url+"' alt='place_image' style='width:500px;height:300px;'></br>"
            + "<h2>"+place_info.name+"  </h2>"
            
            
            +"<p>"+ place_info.formatted_address+ "</p>"
            +"<a href='"+place_info.website+"'> Open Website </a>" ;

              infowindow.setContent(infowindowcontent);
            }
          })
          
          infowindow.open(map, this);

          
        });
*/

        /*
         * The google.maps.event.addListener() event waits for
         * the creation of the infowindow HTML structure 'domready'
         * and before the opening of the infowindow defined styles
         * are applied.
         */
        google.maps.event.addListener(infowindow, 'domready', function() {

           // Reference to the DIV which receives the contents of the infowindow using jQuery
           var iwOuter = $('.gm-style-iw');

           /* The DIV we want to change is above the .gm-style-iw DIV.
            * So, we use jQuery and create a iwBackground variable,
            * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
            */
           var iwBackground = iwOuter.prev();

           // Remove the background shadow DIV
           iwBackground.children(':nth-child(2)').css({'display' : 'none'});

           // Remove the white background DIV
           iwBackground.children(':nth-child(4)').css({'display' : 'none'});

           var iwCloseBtn = iwOuter.next();
           iwCloseBtn.css({'display': 'none'});

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
  mapOptions() {
    if (GoogleMaps.loaded()) {
      return {
        center: kremlin,
        zoom: 13,
        styles: styleArray,
        mapTypeControl: false,
        minZoom: 11,
        streetViewControl: true,
        streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
        }
      };
    }
  }
});
