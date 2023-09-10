const mongoose = require('mongoose');
const Place = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        index:true
    },
    lat:Number,
    long:Number,
    attractions :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:"Attraction"
        }
    ],
    hotels:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref:'hotel'
        }
    ]
})
module.exports = mongoose.model("Place",Place)