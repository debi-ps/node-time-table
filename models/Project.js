const { Schema, SchemaTypes, model } = require('mongoose');

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

module.exports = model('Project', projectSchema);
