const _ = require('lodash');

// var {authenticate} = require('../middleware/authenticate');
var {Restaurant} = require('../schemas/restaurant');

exports.create = (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var restaurant = new Restaurant(body);

    restaurant.save().then(() => {
      return restaurant.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(restaurant);
    }).catch((e) => {
      res.status(400).send(e);
    })
  };

exports.getRestaurant = (req, res) => {
      res.send(req.restaurant);
};
