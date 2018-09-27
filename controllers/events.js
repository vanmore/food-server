const _ = require('lodash');

var {Event} = require('../schemas/event');

exports.create = (req, res) => {
    var event = new Event({
        name:req.body.name,
        description:req.body.description,
        image:req.body.image,
        date:req.body.date,
        price:req.body.price
    });
    event.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
};

exports.getAll = (req, res) => {
    Event.find().then((events) => {
        res.send({events});
      }, (e) => {
        res.status(400).send(e);
      })
};

exports.getEvent = (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
      return res.status(404).send();
  }

  console.log(id);
  Event.findOne({
    _id: id
  }).then((event) => {
    console.log(event);
    if(!event) {
      return res.status(404).send();
    }
    res.send({event});
  }).catch((e) => {
    res.status(400).send();
  });
};

exports.subscribe = (req, res) => {
  var id = req.params.id;
  // console.log(req);
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    next();
  }).catch((e) => {
    res.status(401).send();
  });


  console.log(token);
  console.log(id);
}
