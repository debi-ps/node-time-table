const { handleError } = require('../hooks/handle/error-handle.hook');
const Project = require('../models/Project');

// Create project
module.exports.project_create_post = async (req, res) => {
	const { title, description } = req.body;

	try {
		await Project.create({
			title,
			description,
			user: req.user._id,
		});

		res.status(201).json({ message: 'created' });
	} catch (e) {
		console.log(e);
		const errors = handleError(e);
		res.status(400).json({ errors });
	}
};

// Get project details
module.exports.project_details = async (req, res) => {
	const id = req.params.id;
	const userId = req.user._id;

	try {
		const project = await Project.findOne({ _id: id, user: userId }).select(
			'-user'
		);

		res.json(project);
	} catch (e) {
		handleError(e);
		res.status(404).json({ message: 'project not found' });
	}
};

// Get list of projects
module.exports.project_list_get = async (req, res) => {
	try {
		const projects = await Project.find({ user: req.user._id }).select('-user');

		res.json(projects);
	} catch (e) {
		handleError(e);
		res.status(404).json('projects not found');
	}
};

// Update project data
module.exports.project_update_put = async (req, res) => {
	const id = req.params.id;
	const { title, description } = req.body;

	try {
		const result = await Project.updateOne(
			{ _id: id, user: req.user._id },
			{ title, description }
		);

		if (result.n === 0) {
			return res.status(404).json({ message: 'not found' });
		}

		res.json({ message: 'success' });
	} catch (e) {
		const errors = handleError(e);
		res.status(400).json({ errors });
	}
};

// Delete project
module.exports.project_delete = async (req, res) => {
	const id = req.params.id;

	try {
		const result = await Project.deleteOne({ _id: id, user: req.user._id });

		if (result.n === 0) {
			return res.status(404).json({ message: 'not found' });
		}

		res.json({ message: 'deleted' });
	} catch (e) {
		handleError(e);
		res.status(404).json({ message: 'not found' });
	}
};
