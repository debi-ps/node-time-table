const { Schema, SchemaTypes, model } = require('mongoose');

const projectTaskSpendSchema = new Schema(
	{
		time: {
			type: Number, // time in minutes
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

module.exports = model('ProjectTaskSpend', projectTaskSpendSchema);
