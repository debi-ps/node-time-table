const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter a name.'],
			unique: true,
		},
		email: {
			type: String,
			unique: true,
			required: [true, 'Please enter an email.'],
			lowercase: true,
			validate: [isEmail, 'Please enter a valid email.'],
		},
		password: {
			type: String,
			required: [true, 'Please enter a password.'],
			minLength: [6, 'Minimal length of the password is 6 characters.'],
		},
		isAdmin: {
			type: Boolean,
			required: true,
		},
	},
	{ timestamps: true }
);

// fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
	console.log('new user created and save', doc);

	next();
});

// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
	console.log('user about to be created and saved', this);

	const salt = await bcrypt.genSalt();

	this.password = await bcrypt.hash(this.password, salt);

	next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });

	if (user) {
		const match = await bcrypt.compare(password, user.password);

		if (match) {
			return user;
		}

		throw new Error('incorrect password');
	}

	throw new Error('incorrect email');
};

module.exports = model('User', userSchema);
