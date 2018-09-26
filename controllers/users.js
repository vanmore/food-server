const _ = require('lodash');

// var {authenticate} = require('../middleware/authenticate');
var {User} = require('../schemas/user');

exports.create = (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    });
}

exports.getUser = (req, res) => {
  res.send(req.user);
}

exports.login = (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  console.log(body);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
        console.log('fuck');
        // user = fuck;
        console.log('first');
        // user['x-auth'] = token;
        console.log('last');
        // usertemp = user.toJSON();
        usertemp = user.toObject();
        usertemp["xauth"] = token;
        // usertemp = JSON.stringify(usertemp);

      res.header('x-auth', token).send( _.pick(usertemp, ['_id', 'email', 'xauth']));
    });
  }).catch((e) => {
    res.status(400).send();
  });
}

exports.logout = (req, res) => {
    req.user.removeToken(req.token).then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    });
  }
