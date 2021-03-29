const { Schema, SchemaTypes, model } = require('mongoose');

const projectTaskCommentSchema = new Schema(
	{
		content: {
			type: String,
			required: true,
		},
		user: {
			type: SchemaTypes.ObjectId,
			ref: 'User',
			required: true,
		},
		task: {
			type: SchemaTypes.ObjectId,
			ref: 'ProjectTask',
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model('ProjectTaskComment', projectTaskCommentSchema);
