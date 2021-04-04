// Filters object from undefined values.
// Returns object.
module.exports.filterBody = function (object) {
	return Object.fromEntries(
		Object.entries(object).filter(
			([key, value]) => typeof value !== 'undefined'
		)
	);
};
