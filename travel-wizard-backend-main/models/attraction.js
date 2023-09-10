const mongoose = require('mongoose');
const Attraction = new mongoose.Schema({
    name:String,
    address : {
        type : String,
        required : true,
    },
    
    description:String,
    image:String
})
module.exports = mongoose.model('Attraction',Attraction)