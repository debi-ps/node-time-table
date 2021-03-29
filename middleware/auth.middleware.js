const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

// check if exists valid token in request cookie
const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, config.get('jwt.secret'), (err, decodedToken) => {
			if (err) {
				res.status(401).json({ message: 'unauthorized' });
				return;
			}

			next();
		});
	} else {
		res.status(401).json({ message: 'unauthorized' });
	}
};

// assign user
const assignUser = async (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, config.get('jwt.secret'), async (err, decodedToken) => {
			if (err) {
				req.user = null;

				next();
			} else {
				req.user = await User.findById(decodedToken.id);

				next();
			}
		});
	} else {
		req.user = null;
		next();
	}
};

module.exports = {
	requireAuth,
	assignUser,
};
