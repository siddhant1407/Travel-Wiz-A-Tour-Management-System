const mongoose = require("mongoose"),
	bcrypt = require('bcryptjs');

const credentials = new mongoose.Schema({
	username:{
		type: String,
        unique: true,
        required: true
	},
	password: String,
});

credentials.methods = {
	checkPassword: function(inputPassword) {
		return bcrypt.compareSync(inputPassword, this.password)
	},
	hashPassword: plainTextPassword => {
		return bcrypt.hashSync(plainTextPassword, 10)
	}
}
credentials.pre('save', function(next) {
	// console.log(this);
	if (!this.password) {
		console.log('=======NO PASSWORD PROVIDED=======')
		next()
	} else {
		this.password = this.hashPassword(this.password)
		next()
	}
})

module.exports=mongoose.model("Credentials",credentials);