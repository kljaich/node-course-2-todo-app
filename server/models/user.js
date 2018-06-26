var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
      type: String,
      required: true,
      trim: true,
      minLength: 1
    }
});

module.exports = { User };

// // Create a new User document (not all fields need to be specified)
// var newUser = new User({
//   email: "andrew@example.com"
// });
//
// // Store new User document in mondo database
// newUser.save()
//   .then ((doc) => {
//     console.log(`Saved User ${doc}`);
//   }, (err) => {
//     console.log(`Unable to save User document ${err}`)
//   });
