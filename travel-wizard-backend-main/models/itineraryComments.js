const mongoose = require('mongoose');
const ItineraryCommentsSchema = new mongoose.Schema({
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Credentials"
        },
        username:String
    },
    text:String
})
module.exports = mongoose.model("ItineraryComments",ItineraryCommentsSchema);