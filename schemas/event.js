var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    restId: {
        type: String
    },  
    img: {
       type: String 
    },
    date: {
        type: String
    }, 
    price: {
       type: Number 
    },
    rating: {
        type: String
    },
    comments: [
        
    ]
});


var Event = mongoose.model('Event', EventSchema);

module.exports = {Event};