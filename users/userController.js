"use strict";
const dot = require("dot-object");
const bcryptjs = require("bcryptjs");

const _ = require("lodash");
const catchAsync = require("../error/catchAsync");
const AppError = require("../error/appError");
const {
	passwordBcrypt,
	comparePassword,
} = require("../services/passwordBcrypt");

const ValidationCheck = require("../services/validationUsingClass");
const AuthService = require("../services/authService");
const UserModel = require("../users/userModel");

const { createToken } = require("../util/tokenRelated");
const { SendErrorResponse } = require("../error/ErrorSender");
const sendEmail = require("../util/email");

// send email
const Emailservice = async (req, lastpartofurl, user, next, res) => {
	const resetURL = `${req.protocol}://${req.get(
		"host",
	)}/api/user/reset-password?email=${user.email}&token=${lastpartofurl}`;

	console.log("reset url ", resetURL);
	// let message = `Please use this token ${lastpartofurl} to complete further process`;
	let msg = `Please click on this link  ${resetURL} to complete further process`;
	try {
		await sendEmail({
			email: user.email,
			subject: `Complete your account registration`,
			message: msg,
		});
	} catch (error) {
		console.log(error);

		return next(
			new AppError("There was an error sending email, try later", 500),
		);
	}
};
const regComplete = async (email, role, req, res, next) => {
	const completeRegistration = await UserModel.create({
		email,
		role,
	});

	const userWithToken = completeRegistration.createAccountActivateToken();
	await completeRegistration.save({ runValidators: false });
	Emailservice(req, userWithToken, completeRegistration, next, res);
	res.status(201).json({
		status: "success",
		message: `A account has been created for ${completeRegistration.email}. `,
	});
};

exports.validationAndSignUp = catchAsync(async (req, res, next) => {
	//checkfirstname
	const IsFirstNameNotValid = new ValidationCheck(
		req.body.first_Name,
		"First Name",
	)
		.IsEmpty()
		.print();
	if (IsFirstNameNotValid)
		return SendErrorResponse(IsFirstNameNotValid, 400, next);

	//lastNamecheck
	const IsLastNameNotValid = new ValidationCheck(
		req.body.last_Name,
		"Last Name",
	)
		.IsEmpty()
		.print();
	if (IsLastNameNotValid)
		return SendErrorResponse(IsLastNameNotValid, 400, next);

	//checkpassword
	const IsPasswordNotValid = new ValidationCheck(
		req.body.password,
		"Password",
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsPasswordNotValid)
		return SendErrorResponse(IsPasswordNotValid, 400, next);

	//checkconfirmPassword and validity
	const IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(
		req.body.confirmPassword,
		"Confirm Password",
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.IsPasswordMatched(req.body.password)
		.print();
	if (IsConfirmPasswordNotValidandNotMatched)
		return SendErrorResponse(
			IsConfirmPasswordNotValidandNotMatched,
			400,
			next,
		);
	//checkC
	//phoneField CHeck
	const IsPhoneNumberValid = new ValidationCheck(
		req.body.phone_Number,
		"Phone_Number",
	)
		.IsEmpty()
		.IsString()
		.IsLowerThanMin(11)
		.IsLargerThanMax(12)
		.print();
	if (IsPhoneNumberValid)
		return SendErrorResponse(IsPhoneNumberValid, 400, next);
	//checkemail
	const IsEmailValid = new ValidationCheck(req.body.email, "Email")
		.IsEmpty()
		.IsEmail()
		.print();
	if (IsEmailValid) return SendErrorResponse(IsEmailValid, 400, next);

	const IsFatherNameNotValid = new ValidationCheck(
		req.body.father_Name,
		"Father Name",
	)
		.IsEmpty()
		.print();
	if (IsFatherNameNotValid)
		return SendErrorResponse(IsFatherNameNotValid, 400, next);

	const IsMotherNameNotValid = new ValidationCheck(
		req.body.mother_Name,
		"Mother Name",
	)
		.IsEmpty()
		.print();
	if (IsMotherNameNotValid)
		return SendErrorResponse(IsMotherNameNotValid, 400, next);

	const UserSignUp = await new AuthService(UserModel).SignUp(req.body);

	if (UserSignUp.error === true) {
		return next(new AppError(UserSignUp.ErrorMessage, UserSignUp.code));
	} else {
		console.log("UserSignUp.data._id :", UserSignUp.data.userid);
		res.status(201).json({
			status: "success",
			message: "Account registered",
			token: createToken(UserSignUp.data.userid, req, res),
		});
	}
});

exports.validationAndLogin = catchAsync(async (req, res, next) => {
	/*
  Isempty () -> check email is empty
  IsEmail() -> check is email or not
  print() -> get result
  */
	const IsEmailValid = new ValidationCheck(req.body.email, "Email")
		.IsEmpty()
		.IsEmail()
		.print();
	if (IsEmailValid) return SendErrorResponse(IsEmailValid, 400, next);

	//checkpassword
	const IsPasswordNotValid = new ValidationCheck(
		req.body.password,
		"Password",
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsPasswordNotValid)
		return SendErrorResponse(IsPasswordNotValid, 400, next);

	//call login(req.body) method of authservice(pass db name)
	const UserLogin = await new AuthService(UserModel).Login(req.body);
	if (UserLogin.error === true)
		return next(new AppError(UserLogin.notfoundmessage, UserLogin.code));
	else {
		const { data } = UserLogin;
		res.status(201).json({
			status: "success",
			message: "Login Successfully",

			token: createToken(UserLogin.data._id, req, res),

			data,
		});
	}
});

exports.getMyProfile = catchAsync(async (req, res, next) => {
	const getProfile = await new AuthService(UserModel).findMe(req.user.userid);

	console.log(getProfile);
	res.status(201).json({
		getProfile,
	});
});

exports.userrole = (...restrictedTo) =>
	catchAsync(async (req, res, next) => {
		console.log("data user", restrictedTo);
		const getUserRole = await new AuthService(UserModel).findUserWithRole(
			req.user.userid,
			restrictedTo,
			"lastName",
		);

		getUserRole ? next() : res.status(403).send("You are not allowed");
	});

exports.getallUsers = catchAsync(async (req, res, next) => {
	const getUserList = await new AuthService(UserModel).getAllData();

	res.status(201).json({
		length: getUserList.length,
		data: {
			getUserList,
		},
	});
});

exports.updateUserName = catchAsync(async (req, res, next) => {
	//checkfirstname
	const IsFirstNameNotValid = new ValidationCheck(
		req.body.first_Name,
		"First Name",
	)
		.IsEmpty()
		.IsString()
		.print();
	if (IsFirstNameNotValid)
		return SendErrorResponse(IsFirstNameNotValid, 400, next);

	//lastNamecheck
	const IsLastNameNotValid = new ValidationCheck(
		req.body.last_Name,
		"Last Name",
	)
		.IsEmpty()
		.IsString()
		.print();
	if (IsLastNameNotValid)
		return SendErrorResponse(IsLastNameNotValid, 400, next);
	const finaldata = _.pick(req.body, ["first_Name", "last_Name"]);

	const UpdateallThese = await new AuthService(UserModel).updateInfo(
		req.user.userid,
		req.body,
		finaldata,
	);

	console.log(req.body);
	res.status(201).json({
		status: "success",
		message: "Data Update Successfully",
		data: {
			UpdateallThese,
		},
	});
});

exports.updateParentsInfo = catchAsync(async (req, res, next) => {
	const { father_Name, mother_Name } = req.body.parents_Info;
	const IsFatherNameNotValid = new ValidationCheck(father_Name, "Father Name")
		.IsEmpty()
		.print();
	if (IsFatherNameNotValid)
		return SendErrorResponse(IsFatherNameNotValid, 400, next);

	const IsMotherNameNotValid = new ValidationCheck(mother_Name, "Mother Name")
		.IsEmpty()
		.print();
	if (IsMotherNameNotValid)
		return SendErrorResponse(IsMotherNameNotValid, 400, next);

	const objbeforedot = _.pick(req.body, ["parents_Info.father_Name"]);
	const finaldata = dot.dot(objbeforedot);
	const UpdateallThese = await new AuthService(UserModel).updateInfo(
		req.user.userid,
		finaldata,
	);

	res.status(201).json({
		status: "success",
		message: "Profile Name Updated Successfully",
		data: {
			UpdateallThese,
		},
	});
});

exports.updateContractInfo = catchAsync(async (req, res, next) => {
	//phoneField CHeck
	console.log("body data ", req.body.contract_Info.phone_Number);
	const IsPhoneNumberValid = new ValidationCheck(
		req.body.contract_Info.phone_Number,
		"Phone_Number",
	)
		.IsEmpty()
		.IsString()
		.IsLowerThanMin(11)
		.IsLargerThanMax(12)
		.print();
	if (IsPhoneNumberValid)
		return SendErrorResponse(IsPhoneNumberValid, 400, next);

	const objbeforedot = _.pick(req.body, ["contract_Info.phone_Number"]);
	const finaldata = dot.dot(objbeforedot);
	const UpdateallThese = await new AuthService(UserModel).updateInfo(
		req.user.userid,
		finaldata,
	);

	res.status(201).json({
		status: "success",
		message: "Contract Information updated Successfully",
		data: {
			UpdateallThese,
		},
	});
});
exports.updatePassword = catchAsync(async (req, res, next) => {
	const IsCurrentPassworNotValid = new ValidationCheck(
		req.body.currentPassword,
		"Current Password",
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsCurrentPassworNotValid)
		return SendErrorResponse(IsCurrentPassworNotValid, 400, next);

	const checkcurrentPassword = await new AuthService(
		UserModel,
	).checkCurrentPassword(req.user.userid, req.body.currentPassword);
	console.log("wrong info :", checkcurrentPassword);
	if (checkcurrentPassword.error === true)
		return next(
			new AppError(
				checkcurrentPassword.notfoundmessage,
				checkcurrentPassword.code,
			),
		);

	//checkpassword
	const IsPasswordNotValid = new ValidationCheck(
		req.body.password,
		"Password",
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsPasswordNotValid)
		return SendErrorResponse(IsPasswordNotValid, 400, next);

	//checkconfirmPassword and validity
	const IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(
		req.body.confirmPassword,
		"Confirm Password",
	)
		.IsEmpty()
		.IsPasswordMatched(req.body.password)
		.print();
	if (IsConfirmPasswordNotValidandNotMatched)
		return SendErrorResponse(
			IsConfirmPasswordNotValidandNotMatched,
			400,
			next,
		);

	req.body.password = await bcryptjs.hash(req.body.password, 12);

	const finaldata = _.pick(req.body, ["password"]);
	const UpdateallThese = await new AuthService(UserModel).updateInfo(
		req.user.userid,
		finaldata,
	);

	res.status(201).json({
		status: "success",
		message: "Password updated Successfully",
		data: {
			UpdateallThese,
		},
	});
});

exports.updateActive = catchAsync(async (req, res, next) => {
	const DeactiveUser = await new AuthService(UserModel).updateRole(
		req.user.userid,
	);
	res.cookie("jwt", "loggedout", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(201).json({
		status: "success",
		message: DeactiveUser,
	});
});

exports.updateUserRequest = catchAsync(async (req, res, next) => {
	const UpdateAccont = await new AuthService(UserModel).updateRequest(
		req.body.email,
	);

	res.status(201).json({
		status: "success",
		message: UpdateAccont,
	});
});

exports.logoutUser = catchAsync(async (req, res, next) => {
	res.cookie("jwt", "loggedout", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(201).json({ status: "success", message: "You have logged out" });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	const { password, confirmPassword, email } = req.body;

	//checkpassword
	const IsPasswordNotValid = new ValidationCheck(password, "Password")
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsPasswordNotValid)
		return SendErrorResponse(IsPasswordNotValid, 400, next);

	//checkconfirmPassword and validity
	const IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(
		confirmPassword,
		"Confirm Password",
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.IsPasswordMatched(req.body.password)
		.print();
	if (IsConfirmPasswordNotValidandNotMatched)
		return SendErrorResponse(
			IsConfirmPasswordNotValidandNotMatched,
			400,
			next,
		);

	//check email
	const IsEmailNotValid = new ValidationCheck(email, "Email")
		.IsEmpty()
		.IsEmail()
		.print();
	if (IsEmailNotValid) return SendErrorResponse(IsEmailNotValid, 400, next);

	const isUserFound = await new AuthService(UserModel).isUserExist(email);

	console.log("user data", isUserFound);
	if (isUserFound.code == false) {
		res.status(404).json({
			status: "fail",
			message: "email is not existed",
		});
	} else {
		const { user } = isUserFound;

		user.password = await passwordBcrypt(password);
		console.log("user data", user);

		await user.save();

		res.status(201).json({
			status: "success",
			user,
			token: createToken(user._id, req, res),
		});
	}
});

exports.registrationComplete = catchAsync(async (req, res, next) => {
	const { accountActivateToken, email, password, confirmPassword } = req.body;

	//checkpassword
	const IsPasswordNotValid = new ValidationCheck(password, "Password")
		.IsEmpty()
		.IsLowerThanMin(6)
		.print();
	if (IsPasswordNotValid)
		return SendErrorResponse(IsPasswordNotValid, 400, next);

	//checkconfirmPassword and validity
	const IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(
		confirmPassword,
		"Confirm Password",
	)
		.IsEmpty()
		.IsLowerThanMin(6)
		.IsPasswordMatched(req.body.password)
		.print();
	if (IsConfirmPasswordNotValidandNotMatched)
		return SendErrorResponse(
			IsConfirmPasswordNotValidandNotMatched,
			400,
			next,
		);
	let value = {};
	value.email = email;
	const IsEmailExist = await new AuthService(UserModel).isDataExist(value);

	if (IsEmailExist.error == false) {
		console.log("Wrong from 637");
		return SendErrorResponse("URL not valid", 404, next);
	}
	if (IsEmailExist.data.accountActivateToken != accountActivateToken) {
		console.log("wrong from 676");
		return SendErrorResponse("URL not valid", 404, next);
	}
	IsEmailExist.data.password = await passwordBcrypt(password);
	IsEmailExist.data.accountActivateToken = undefined;
	IsEmailExist.data.request = "active";

	console.log("user data", IsEmailExist);

	await IsEmailExist.data.save();

	res.status(201).json({
		status: "success",
		user: IsEmailExist.data,
		token: createToken(IsEmailExist.data._id, req, res),
	});
});

exports.updateProfile = catchAsync(async (req, res, next) => {
	//checkfirstname
	const IsFirstNameNotValid = new ValidationCheck(
		req.body.first_Name,
		"First Name",
	)
		.IsEmpty()
		.print();
	if (IsFirstNameNotValid)
		return SendErrorResponse(IsFirstNameNotValid, 400, next);

	//lastNamecheck
	const IsLastNameNotValid = new ValidationCheck(
		req.body.last_Name,
		"Last Name",
	)
		.IsEmpty()
		.print();
	if (IsLastNameNotValid)
		return SendErrorResponse(IsLastNameNotValid, 400, next);
	//phoneField CHeck
	const IsPhoneNumberValid = new ValidationCheck(
		req.body.phone_Number,
		"Phone_Number",
	)
		.IsEmpty()
		.IsString()
		.IsLowerThanMin(11)
		.IsLargerThanMax(12)
		.print();
	if (IsPhoneNumberValid)
		return SendErrorResponse(IsPhoneNumberValid, 400, next);

	const updateProfileData = _.pick(req.body, [
		"first_Name",
		"last_Name",
		"phone_Number",
	]);

	const UpdateUserProfileData = await new AuthService(UserModel).updateInfo(
		req.user.userid,
		updateProfileData,
	);

	res.status(201).json({
		status: "success",
		message: "Profile has been updated Successfully",
		data: {
			UpdateUserProfileData,
		},
	});
});
