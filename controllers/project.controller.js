const { handleError } = require('../hooks/handle/error-handle.hook');
const Project = require('../models/Project');
const User = require('../models/User');
const { filterBody } = require('../hooks/handle/body-handle.hook');

// Create project
module.exports.project_create_post = async (req, res) => {
	const userId = req.user._id;
	const { title, description } = req.body;

	try {
		const project = await Project.create({
			title,
			description,
			user: userId,
		});

		const user = await User.findById(userId);

		user.projects.push(project._id);

		await user.save();

		res.status(201).json(project);
	} catch (e) {
		const errors = handleError(e);
		res.status(400).json({ errors });
	}
};

// Get project details.
module.exports.project_details = async (req, res) => {
	const id = req.params.id;
	const userId = req.user._id;

	try {
		const project = await User.getProject(userId, id);

		if (!project) {
			res.status(404).json();
		}

		res.json(project);
	} catch (e) {
		handleError(e);
		res.status(404).json({ message: 'project not found' });
	}
};

// Get list of available user projects.
module.exports.project_list_get = async (req, res) => {
	const userId = req.user._id;

	try {
		const user = await User.findById(userId)
			.populate({
				path: 'projects',
				select: '-user',
			})
			.select('projects');

		res.json(user.projects);
	} catch (e) {
		handleError(e);
		res.status(500).json();
	}
};

// Get list of projects created by this user.
module.exports.project_owned_list_get = async (req, res) => {
	const user = req.user._id;

	try {
		const projects = await Project.find({ user });

		res.json(projects);
	} catch (e) {
		handleError(e);
		res.status(500).json();
	}
};

// Update project data
module.exports.project_update_put = async (req, res) => {
	const id = req.params.id;
	const { title, description } = req.body;

	const updatable = filterBody({ title, description });

	try {
		const result = await Project.updateOne(
			{ _id: id, user: req.user._id },
			updatable,
			{ runValidators: true }
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
		const project = await Project.findOne({ _id: id, user: req.user._id });

		if (!project) {
			return res.status(404).json({ message: 'not found' });
		}

		await project.remove();

		res.json({ message: 'deleted' });
	} catch (e) {
		handleError(e);
		res.status(404).json({ message: 'not found' });
	}
};
