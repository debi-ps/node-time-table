const User = require('../models/User');
const { handleError } = require('../hooks/handle/error-handle.hook');

// Check if project field provided in body matches user's available projects.
module.exports.matchProject = async (req, res, next) => {
	const userId = req.user._id;
	const { project } = req.body;

	try {
		if (project && userId) {
			const user = await User.findById(userId);

			if (user) {
				if (user.projects.includes(project)) {
					return next();
				}
			}
		}

		res.status(403).json();
	} catch (e) {
		handleError(e);
		res.status(500).json();
	}
};
