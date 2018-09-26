var {Restaurant} = require('./../schemas/restaurant');

var authenticateRestaurant = (req, res, next) => {
  var token = req.header('x-auth');

  Restaurant.findByToken(token).then((restaurant) => {
    if (!restaurant) {
      return Promise.reject();
    }

    req.restaurant = restaurant;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticateRestaurant};
