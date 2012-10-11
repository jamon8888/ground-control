Meteor.publish('posts', function() {
  return Posts.find();
});

// anyone can edit any post, but you do need to be logged in
Posts.allow({
  insert: function(userId, post) { 
    return !!userId && _.isEmpty(validatePost(post));
  },
  update: function(userId) { 
    // XXX: it'd be nice to check that the posts are valid here, but it's THB
    return !! userId;
  },
  remove: function(userId) { 
    return !! userId;
  },
  fetch: []
});

// can't change slug
Posts.deny({
  insert: function(userId, docs, fields) {
    return _.contain(fields, 'slug');
  }
})


// XXX: resolve if this is the right way to do this
Meteor.methods({
  'noUsers': function() {
    return Meteor.users.find().count() === 0;
  }
})

// user account validation. Set this value in server/configuration.js
Accounts.validateNewUser(function(proposedUser) {
  var email = proposedUser.services.google.email;
  
  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }
  
  if (_.isRegExp(Accounts.allowedEmails))
    return Accounts.allowedEmails.test(email);
  else
    return endsWith(email, Accounts.allowedEmails);
});