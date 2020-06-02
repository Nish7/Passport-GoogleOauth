const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('./Model/User');

router.get(
	'/',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);

router.get(
	'/callback',
	passport.authenticate('google', {
		session: false,
	}),
	async (req, res, next) => {
		try {
			const token = await jwt.sign(
				{
					id: req.user._id,
				},
				'secretKey',
				{ expiresIn: '1d' }
			);
			res
				.cookie('token', token, { maxAge: 86400000 })
				.redirect('/auth/google/me');
		} catch (err) {
			console.log(err);
		}
	}
);

router.get('/me', loggedInMiddleware, async (req, res) => {
	try {
		const token = req.cookies.token;
		const decoded = await jwt.verify(token, 'secretKey');
		if (!decoded) {
			console.log('Error');
		} else {
			const user = await User.findById(decoded.id);
			res.json({ user, token });
		}
	} catch (err) {
		res.json(err.message);
	}
});

router.get('/clear', (req, res) => {
	res.clearCookie('token');
	res.json({ Response: 'Logout' });
});

function loggedInMiddleware(req, res, next) {
	if (req.cookies.token) {
		next();
	} else {
		res.status(401).json({ response: 'unauthorized' });
	}
}

module.exports = router;
