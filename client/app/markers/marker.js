//Handles button click events
  Template.body.events({
    'click .upvotebutton': function (e) {
      e.preventDefault();

      Meteor.call('upvote', this.id, (err, response)=>{
        if(err) {
          Session.set('serverDataResponse', "Error:" + err.reason);
          return;
        }
        Session.set('serverDataResponse', response);
      }); 
    },
    'click .downvotebutton': function (e) {
      e.preventDefault();
      Meteor.call('downvote', this.id, (err, response)=>{
        if(err) {
          Session.set('serverDataResponse', "Error:" + err.reason);
          return;
        }
        Session.set('serverDataResponse', response);
      }); 
    }
  });