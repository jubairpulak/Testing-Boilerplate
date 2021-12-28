const express = require("express");

const router = express.Router();
const {
	validationAndSignUp,
	validationAndLogin,
	getMyProfile,
	userrole,
	getallUsers,
	updatePassword,
	updateActive,
	logoutUser,
	getAll,
	resetPassword,
	registrationComplete,
	updateProfile,
} = require("./userController");

const { userauthorization } = require("../middleware/userMiddleware");

//for all

router.route("/login").post(validationAndLogin);

router.route("/signup").post(validationAndSignUp);
router.route("/reset-password").post(resetPassword);

router.route("/get-me").get(userauthorization, getMyProfile);
//student get profile and course

router.route("/get-all").get(userauthorization, userrole("admin"), getallUsers);

router.route("/update-password").patch(userauthorization, updatePassword);
router.route("/deactive-me").patch(userauthorization, updateActive);

router.route("/logout").post(userauthorization, logoutUser);

router.route("/update-profile").patch(userauthorization, updateProfile);

router.route("/user/account-verify").patch(registrationComplete);

module.exports = router;
