import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
    checkPlacesNearby() {
        this.unblock();
        return Meteor.http.call("GET", "http://search.twitter.com/search.json?q=perkytweets");
    }
});