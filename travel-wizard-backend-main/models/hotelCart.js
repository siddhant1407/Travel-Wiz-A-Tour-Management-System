const mongoose = require('mongoose');
const HotelCartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true
    },
    hotels:[{
        hotel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Hotel"
        },
        room:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Room"
        },
        startDate:Date,
        endDate: Date,
        bookedStatus: Boolean
    }]
})
module.exports = mongoose.model('HotelCart',HotelCartSchema);