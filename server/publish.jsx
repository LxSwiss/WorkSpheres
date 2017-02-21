Markers = new Mongo.Collection('markers');

//define which data should be published visible

Meteor.publish("allMarkers", function(){
	return Markers.find();
});

