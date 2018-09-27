require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
// var {Todo} = require('./models/todo');
var {User} = require('./schemas/user');
var {Restaurant} = require('./schemas/restaurant');
var app = express();
var eventsController = require('./controllers/events');
var {authenticate} = require('./middleware/authenticate');
var {authenticateRestaurant} = require('./middleware/authenticateRestaurant');
var restaurantsController = require('./controllers/restaurants');
var usersController = require('./controllers/users');


const port = process.env.PORT;
//configuring the middleware
app.use(bodyParser.json());


app.post('/events', authenticateRestaurant, eventsController.create);
app.get('/events', eventsController.getAll);
app.get('/events/:id', eventsController.getEvent);
app.patch('/events/:id/subscribe', eventsController.subscribe);


// POST /users
app.post('/users', usersController.create);
app.get('/users/me', authenticate, usersController.getUser);
app.post('/users/login', usersController.login);
app.delete('/users/logout', authenticate, usersController.logout);


  // POST /restaurants
app.post('/restaurants', restaurantsController.create);
app.get('/restaurants/me', authenticateRestaurant, restaurantsController.getRestaurant);

    app.post('/restaurants/login', (req, res) => {
      var body = _.pick(req.body, ['email', 'password']);

      console.log(body);

      Restaurant.findByCredentials(body.email, body.password).then((restaurant) => {
        return restaurant.generateAuthToken().then((token) => {
          res.header('x-auth', token).send(restaurant);
        });
      }).catch((e) => {
        res.status(400).send();
      });
    });

    app.delete('/restaurants/me/token', authenticateRestaurant, (req, res) => {
      req.restaurant.removeToken(req.token).then(() => {
        res.status(200).send();
      }, () => {
        res.status(400).send();
      });
    });

// app.listen(3000, () => {
//     console.log('Started on port 3000');
// });

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
  });
module.exports = {app};
