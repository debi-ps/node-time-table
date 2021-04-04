const { handleError } = require('../hooks/handle/error-handle.hook');
const { filterBody } = require('../hooks/handle/body-handle.hook');
const ProjectTask = require('../models/ProjectTask');
const User = require('../models/User');

// Create task.
module.exports.task_create_post = async (req, res) => {
	const { title, description, project, assigne, executor } = req.body;

	try {
		const task = await ProjectTask.create({
			title,
			description,
			project,
			assigne: assigne || req.user._id,
			executor,
		});

		res.status(201).json(task);
	} catch (e) {
		const errors = errorHandle(e);
		res.status(400).json({ errors });
	}
};

// Get task list.
module.exports.task_list_get = async (req, res) => {
	const user = req.user._id;
	const type = req.params.type;

	if (!['executor', 'assigne'].includes(type)) {
		return res.status(400).json({ message: 'bad list type provided' });
	}

	try {
		const tasks = await ProjectTask.find({ [type]: user });

		res.json(tasks);
	} catch (e) {
		// errorHandle(e);
		res.status(500).json({ message: 'server error' });
	}
};

// Update task.
module.exports.task_update_put = async (req, res) => {
	const id = req.params.id;
	const { title, description, project, assigne, executor } = req.body;

	const updatable = filterBody({
		title,
		description,
		project,
		assigne,
		executor,
	});

	try {
		const result = await ProjectTask.updateOne({ _id: id }, updatable, {
			runValidators: true,
		});

		if (result.n === 0) {
			return res.status(404).json({ message: 'not found' });
		}

		res.json({ message: 'success' });
	} catch (e) {
		const errors = handleError(e);

		res.status(400).json({ errors });
	}
};

// Get task details.
module.exports.task_details = async (req, res) => {
	const id = req.params.id;

	try {
		const task = await ProjectTask.findById(id);

		res.json(task);
	} catch (e) {
		handleError(e);
		res.status(500).json({ message: 'server error' });
	}
};

// Delete task.
module.exports.task_delete = async (req, res) => {
	const id = req.params.id;

	try {
		const task = await ProjectTask.findById(id);

		await task.remove();

		res.json({ message: 'success' });
	} catch (e) {
		handleError(e);
		res.status(500).json({ message: 'server error' });
	}
};
