
const mongoose = require('mongoose');
const roomType = new mongoose.Schema({
    description:String,
    maximumOccupancy:Number,
})
module.exports = mongoose.model('RoomType', roomType);