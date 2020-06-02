const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

let User = require('../Model/User');

module.exports = function (passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				callbackURL: 'http://localhost:8080/auth/google/callback',
			},
			(token, refreshToken, profile, done) => {
				let Checkuser;
				User.findOne({ id: profile.id })
					.then((user) => {
						Checkuser = user;
					})
					.catch((err) => console.log(err));

				if (Checkuser) return done(null, user);
				else {
					let newUser = new User();

					newUser.id = profile.id;
					newUser.token = token;
					newUser.name = profile.displayName;
					newUser.photo = profile.photos[0].value;
					newUser.email = profile.emails[0].value;

					newUser
						.save()
						.then(() => done(null, newUser))
						.catch((err) => console.log(err));

					// // save the user
					// newUser.save(function (err) {
					// 	if (err) return done(err);
					// 	return done(null, newUser);
					// });
				}
			}
		)
	);

	// passport.serializeUser((user, done) => {
	// 	return done(null, user.id);
	// });

	// passport.deserializeUser((id, done) => {
	// 	User.findOne({ id })
	// 		.then((user) => {
	// 			done(null, user);
	// 		})
	// 		.catch((err) => done(err));
	// });
};
