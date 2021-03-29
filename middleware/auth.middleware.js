const jwt = require('jsonwebtoken');
const config = require('config');

const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	// check json token exists & verified
	if (token) {
		jwt.verify(token, config.get('jwt.secret'), (err, decodedToken) => {
			if (err) {
				console.log(err);
				res.status(401).json({ message: 'unauthorized' });
				return;
			}

			console.log(decodedToken);
			next();
		});
	} else {
		res.status(401).json({ message: 'unauthorized' });
	}
};

module.exports = {
	requireAuth,
};
