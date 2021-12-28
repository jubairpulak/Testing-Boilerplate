const bcryptjs = require("bcryptjs");

exports.passwordBcrypt = async (password) => await bcryptjs.hash(password, 12);
exports.comparePassword = async (storedPass, newPass) =>
	await bcryptjs.compare(newPass, storedPass);
