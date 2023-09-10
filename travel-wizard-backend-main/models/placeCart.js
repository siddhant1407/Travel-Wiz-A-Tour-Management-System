const mongoose = require('mongoose');
const placeCart = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true
    },
    places:[{
       place: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Place"
        },
        visitingDate:Date,
    }],
})

module.exports = mongoose.model('PlaceCart', placeCart)