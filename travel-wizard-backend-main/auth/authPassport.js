require('dotenv').config();
const passport = require('passport'),
     localStrategy = require('passport-local').Strategy,
     googleStrategy = require('passport-google-oauth20').Strategy;
const Credentials = require("../models/credentials"),
	User = require('../models/userDetails');
passport.serializeUser(function(user, done) {
	return done(null, user);
});

passport.deserializeUser(function(obj, done) {
	return done(null, obj);
});
passport.use(new localStrategy(
	{
		usernameField: 'username'
	},
	function(username, password, done) {
		Credentials.findOne({ 'username': username }, (err, userMatch) => {
			if (err) {
				return done(err)
			}
			if (!userMatch) {
				return done(null, false, { message: 'Incorrect username' })
			}
			if (!userMatch.checkPassword(password)) {
				return done(null, false, { message: 'Incorrect password' })
			}
			return done(null, userMatch)
		})
	}
));
passport.use(new googleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback  : true
},async (request, accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    const googleUser = profile._json;
    let user = await User.findOne({email: googleUser.email});
    if(user==null) {
        user = await User.create({email:googleUser.email,fn:googleUser.given_name,ln:googleUser.family_name,verified:googleUser.email_verified});
    }
    await user.save();    
    return done(null, user);
}
));
module.exports = passport;