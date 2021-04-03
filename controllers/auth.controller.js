const jwt = require('jsonwebtoken');
const config = require('config');
const { handleError } = require('../hooks/handle/error-handle.hook');

const User = require('../models/User');

const maxAge = config.get('jwt.maxAge');

const createToken = (id) => {
	return jwt.sign({ id }, config.get('jwt.secret'), {
		expiresIn: maxAge,
	});
};

const setJwtCookie = (res, token) => {
	res.cookie('jwt', token, {
		httpOnly: true,
		maxAge: maxAge * 1000,
	});
};

// Signup user
const signup = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const user = await User.create({ name, email, password, isAdmin: false });
		const token = createToken(user._id);

		res.cookie('jwt', token, {
			httpOnly: true,
			maxAge: maxAge * 1000,
		});
		res.status(201).json({ message: 'success' });
	} catch (e) {
		const errors = handleError(e);

		res.status(400).json({ errors });
	}
};

// Login user
const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.login(email, password);

		const token = createToken(user._id);

		setJwtCookie(res, token);

		res.json({ message: 'success' });
	} catch (e) {
		console.log(e);
		const errors = handleError(e);
		res.status(400).json(errors);
	}
};

// Logout user
const logout = async (req, res) => {
	try {
		res.cookie('jwt', '', { maxAge: 1 });
		res.json({ message: 'success' });
	} catch (e) {
		console.log(e);
		res.status(500).json();
	}
};

// User token self lookup
const me_get = async (req, res) => {
	res.json(req.user);
};

module.exports = {
	signup,
	login,
	logout,
	me_get,
};
