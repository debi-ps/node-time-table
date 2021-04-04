const { Schema, SchemaTypes, model } = require('mongoose');
const User = require('./User');

const projectSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required for project.'],
		},
		description: String,
		user: {
			type: SchemaTypes.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

projectSchema.pre('remove', async function (next) {
	const users = await User.find({
		projects: this._id,
	}).select('projects');

	for (let user of users) {
		user.projects = user.projects.filter((id) => {
			return !id.equals(this._id);
		});
		await user.save();
	}

	next();
});

module.exports = model('Project', projectSchema);
