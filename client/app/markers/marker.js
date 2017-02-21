//Handles button click events
  Template.body.events({
    'click .upvotebutton': function (e) {
      e.preventDefault();
      let currentmarker = Markers.findOne(this.id, {_id:1});
      let newupvotes = ++currentmarker.upvotes;
      Markers.update(this.id, {$set: {upvotes: newupvotes}})
    },
    'click .downvotebutton': function (e) {
      e.preventDefault();
      let currentmarker = Markers.findOne(this.id, {_id:1});
      let newdownvotes = ++currentmarker.downvotes;
      Markers.update(this.id, {$set: {downvotes: newdownvotes}});
    }
  });