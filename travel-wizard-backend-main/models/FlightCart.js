const mongoose = require('mongoose');
const FlightCartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true
    },
    flights:[{
        flight:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Flight"
        },
        date: Date,
        bookedStatus: Boolean
    }]
})
module.exports = mongoose.model('FlightCart',FlightCartSchema);