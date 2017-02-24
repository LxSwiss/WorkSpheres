import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  console.log("startup funcion");

  // initialization of 2 markers if database is empty to give S
   if (Markers.find().count() === 0) {
    [
      {	
      	"lat": 48.8637346,
  		"lng": 2.287377200000037,
 		 "name": "Café Kléber",
  		"place_id": "ChIJXQvlQftv5kcR0ssQdKPzrIY",
 		 "upvotes": 0,
  		"downvotes": 0
  		},
      {  
      	"lat": 48.85947169999999,
  		"lng": 2.306002400000011,
  		"name": "Starbucks",
  		"place_id": "ChIJzxrQ1dhv5kcRH3viFwexCoE",
  		"upvotes": 0,
  		"downvotes": 0 
  		},
      ].forEach(function(marker){
      Markers.insert(marker);
    });
  }

});

Meteor.methods({
    checkPlacesNearby() {
        this.unblock();
        return Meteor.http.call("GET", "http://search.twitter.com/search.json?q=perkytweets");
    }
});