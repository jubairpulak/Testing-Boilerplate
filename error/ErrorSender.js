const AppError = require("./appError");

exports.SendErrorResponse = (errorMessage, statusCode, next) => {
	next(new AppError(errorMessage, statusCode));
};
