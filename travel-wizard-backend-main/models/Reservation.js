const mongoose = require('mongoose');
const ReservationSchema = new mongoose.Schema({
    guestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true,
        index:true
    },
    roomReservations:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RoomReservation"
    }],
    totalPrice:Number,
    startDate:Date,
    endDate:Date
})
module.exports = mongoose.model('Reservation',ReservationSchema);