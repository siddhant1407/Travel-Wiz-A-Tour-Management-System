const mongoose = require('mongoose');
const Hotel = new mongoose.Schema({
    name: String,
    address: String,
    image:String,
    rooms:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Room'
    }],// refers to another room associated with the hotel
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }],
    avgRating:Number
})
module.exports=mongoose.model("Hotel",Hotel);