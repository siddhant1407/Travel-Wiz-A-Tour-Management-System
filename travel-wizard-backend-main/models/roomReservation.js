const mongoose = require('mongoose');
const roomReservation = new mongoose.Schema({
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room"
    },
    reservationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reservation"
    }
})
module.exports = mongoose.model('RoomReservation', roomReservation)