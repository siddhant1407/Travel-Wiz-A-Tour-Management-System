const mongoose = require('mongoose');
const OTP = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
	otp: String,
});

module.exports = mongoose.model('otp',OTP);