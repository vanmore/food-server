var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin123@ds161092.mlab.com:61092/food-card-db',
{ useNewUrlParser: true });

module.exports = {mongoose};