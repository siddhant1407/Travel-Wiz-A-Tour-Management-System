const mongoose = require('mongoose');
const PrimaryItinerarySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        unique:true,
        ref:"User"
    },
    placeCart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PlaceCart"
    },
    hotelCart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"HotelCart"
    },
    flightCart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FlightCart"
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ItineraryComments"
    }]
})
module.exports = mongoose.model("PrimaryItinerary",PrimaryItinerarySchema);