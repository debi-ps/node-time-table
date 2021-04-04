const { Schema, model, SchemaTypes } = require('mongoose');
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
			select: false,
		},
		isAdmin: {
			type: Boolean,
			required: true,
		},
		projects: [
			{
				type: SchemaTypes.ObjectId,
				ref: 'Project',
			},
		],
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	const salt = await bcrypt.genSalt();

	this.password = await bcrypt.hash(this.password, salt);

	next();
});

// login user
userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email }).select('+password');

	if (user) {
		const match = await bcrypt.compare(password, user.password);

		if (match) {
			return user;
		}

		throw new Error('incorrect password');
	}

	throw new Error('incorrect email');
};

// get project if user has access to it.
// Return null if not found.
userSchema.statics.getProject = async function (userId, projectId) {
	const result = await this.findById(userId)
		.populate({
			path: 'projects',
			match: { _id: projectId },
		})
		.select('projects _id');

	if (result.projects.length !== 0) {
		return result.projects[0];
	}

	return null;
};

module.exports = model('User', userSchema);
