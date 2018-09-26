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
}