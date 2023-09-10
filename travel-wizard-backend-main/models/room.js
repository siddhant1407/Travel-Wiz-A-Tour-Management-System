const mongoose = require('mongoose');
const Room = new mongoose.Schema({
    roomNumber:String,
    price:Number,
    hotelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hotel'
    },
    roomReservations:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RoomReservation"
    }],
    roomType:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Roomtype'
    }
})

module.exports=mongoose.model("Room",Room);