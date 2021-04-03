const handleError = (err) => {
	const errors = {};

	console.log(err);

	// duplicate error code
	if (err.code === 11000) {
		Object.keys(err.keyValue).forEach((field) => {
			errors[field] = `Field ${field} is already in use.`;
		});

		return errors;
	}

	// validation errors
	if (err.message.includes('validation failed')) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	// ObjectId errors
	if (err.message.includes('Cast to ObjectId failed')) {
		errors[err.path] = `Invalid ${err.path}`;
	}

	return errors;
};

module.exports = {
	handleError,
};
