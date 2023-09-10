const mongoose = require('mongoose');
const Review = new mongoose.Schema({
    rating:Number,
    comment:String,
    author:String
})
module.exports = mongoose.model('Review',Review);