const { Schema, SchemaTypes, model } = require('mongoose');
const config = require('config');

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
		status: {
			type: String,
			enum: config.get('app.task.statuses.list'),
			default: config.get('app.task.statuses.init'),
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
