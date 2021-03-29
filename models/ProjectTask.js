const { Schema, SchemaTypes, model } = require('mongoose');

const projectTaskSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: String,
		project: {
			type: SchemaTypes.ObjectId,
			ref: 'Project',
			required: true,
		},
		assigne: {
			type: SchemaTypes.ObjectId,
			ref: 'User',
			required: true,
		},
		executor: {
			type: SchemaTypes.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

module.exports = model('ProjectTask', projectTaskSchema);
