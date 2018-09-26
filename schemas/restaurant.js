const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var RestaurantSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
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

RestaurantSchema.methods.toJSON = function () {
  var restaurant = this;
  var restObject = restaurant.toObject();

  return _.pick(restObject, ['_id', 'email']);
};

RestaurantSchema.methods.generateAuthToken = function () {
  var restaurant = this;
  var access = 'auth';
  var token = jwt.sign({_id: restaurant._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  restaurant.tokens.push({access, token});
  console.log('Genereting token');
  return restaurant.save().then(() => {
    return token;
  });
};

RestaurantSchema.methods.removeToken = function (token) {
  var restaurant = this;

  return restaurant.update({
    $pull: {
      tokens: {token}
    }
  });
};

RestaurantSchema.statics.findByToken = function (token) {
  var Restaurant = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return Restaurant.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

RestaurantSchema.statics.findByCredentials = function (email, password) {
  var Restaurant = this;

  return Restaurant.findOne({email}).then((restaurant) => {
    if (!restaurant) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, restaurant.password, (err, res) => {
        if (res) {
          console.log('resolving');
          resolve(restaurant);
        } else {
          reject();
        }
      });
    });
  });
};

RestaurantSchema.pre('save', function (next) {
  var restaurant = this;

  if (restaurant.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(restaurant.password, salt, (err, hash) => {
        restaurant.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = {Restaurant}
