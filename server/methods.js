Meteor.methods({
  addMarker(marker){
            // If the request succeeds, insert the marker into the database
            // upsert only inserts if place.id doesnt exist yet
            Markers.upsert(marker.place_id, {
              //Modifier
              $set: {
                lat: marker.lat,
                lng: marker.lng,
                name: marker.name,
                place_id: marker.place_id,
              }
            });

            //marker element which has just been upserted
            let tmpmarker =  Markers.findOne(marker.place_id, {place_id:1});

            if(tmpmarker.upvotes ==undefined){
              Markers.update(tmpmarker._id, {$set: {upvotes: 0}});
            }
            if(tmpmarker.downvotes ==undefined){
              Markers.update(tmpmarker._id, {$set: {downvotes: 0}});
            }
    },
    upvote(id){
      let tmpmarker = Markers.findOne(id, {_id:1});
      Markers.update(id, {$set: {upvotes: ++ tmpmarker.upvotes}});
      console.log(tmpmarker.place_id+ " has been upvoted: "+ tmpmarker.upvotes+ " upvotes");
    },
    downvote(id){
      let tmpmarker = Markers.findOne(id, {_id:1});
      Markers.update(id, {$set: {downvotes: ++ tmpmarker.downvotes}});
      console.log(tmpmarker.place_id+ " has been downvoted: "+ tmpmarker.downvotes+ " downvotes");
    },
    getScore(id){
      let tmpmarker = Markers.findOne(marker.place_id, {place_id:1});
      return tmpmarker.upvotes - tmpmarker.downvotes;
    }



});