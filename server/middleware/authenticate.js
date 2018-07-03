var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');
  User.findByToken(token).then((user) => {
    if (!user) {
      // OR res.send(401).send();  The following just falls thru
      // to catch() block below.
      return new Promise.reject();
    }
    // res.send(user);
    req.user = user
    req.token = token;

    // Successfully authenticated, so proceed to route
    next();
  }).catch((e) => {
    // Error case, don't call next() because we don't want to proceed to
    // the route
    res.send(401).send();
  })
}

module.exports = {authenticate};
