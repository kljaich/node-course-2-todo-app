const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema ({
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        validator: (value) => {
          return(validator.isEmail(value))
        },
        message: '{VALUE} is not a valid email'
      }
      // Or
      // validate:
      //  validator: validator.isEmail;
      //  message: ('{VALUE}' is not a valid email);
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
});

// Override the toJSON method
UserSchema.methods.toJSON = function () {
  var user = this;

  //  Convert mongoose Object (e.g., user) to a normal Object to be returned
  var userObject = user.toObject();

  // Don't return the password or the authentication tokens
  var rrr =  _.pick(userObject, ['_id', 'email']);

  // return _.pick(userObject, ['_id', 'email']);
  return rrr;
};

// Model method
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    // Return a new promise that will never succeed, e.g., it will
    // always be rejected.
    // OR return new Promise.reject();
    return new Promise((resolve, reject) => {
      reject();
    });
  };

  // Return promise so call can chain promise with another
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

// Instance method
UserSchema.methods.generateAuthToken = function () {

  // console.log("HERE I AM");
  // "this" not accessible in an arrow function, but we
  // need to access the document to get at its properties
  var user = this;

  var access='auth';
  var token = jwt.sign({
    _id: user._id.toHexString(), access
  }, 'abc123').toString();

  // user.tokens.push({access, token});
  user.tokens = user.tokens.concat([{access, token}]);
  // console.log("HERE I AM", token);

  // For success case, returning token so server.js has it, and can chain on
  // a promise if needed, for this case, the token will simply be passed to
  // the success leg of the new promise for server.js.
  return user.save().then(() => {
//    console.log("HHHHHHHERRRRR");
    return token;
  });

  // Should never have gotten called.
//  console.log("KKKKKKKK");
  /// return(token);
};

// Mongoose Middleware: called if saving a user document via Mongoose
UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hashedPassword) => {
        console.log(hashedPassword);
        user.password = hashedPassword;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = { User };
