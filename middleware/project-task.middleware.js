const { handleError } = require('../hooks/handle/error-handle.hook');
const ProjectTask = require('../models/ProjectTask');
const User = require('../models/User');

// Force user to have project, related to task requested task.
module.exports.matchTask = async (req, res, next) => {
	const id = req.params.id;
	const userId = req.user._id;

	try {
		const task = await ProjectTask.findById(id);

		if (!task) {
			return res.status(404).json({ message: 'not found' });
		}

		if (
			(await User.findOne(userId).select('projects')).projects.includes(
				task.project
			)
		) {
			return next();
		}

		res.status(403).json();
	} catch (e) {
		handleError(e);
	}
};
