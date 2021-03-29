const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

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

// handle errors
const handleError = (err) => {
	const errors = {};

	// duplicate error code
	if (err.code === 11000) {
		Object.keys(err.keyValue).forEach((field) => {
			errors[field] = `Field ${field} is already in use.`;
		});

		return errors;
	}

	// validation errors
	if (err.message.includes('User validation failed')) {
		Object.values(err.errors).forEach(({ properties }) => {
			if (['name', 'email', 'password'].includes(properties.path)) {
				errors[properties.path] = properties.message;
			}
		});
	}

	return errors;
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
		res.status(500).json();
	}
};

module.exports = {
	signup,
	login,
	logout,
};
