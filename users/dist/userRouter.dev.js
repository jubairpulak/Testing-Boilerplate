"use strict";

var express = require("express");

var router = express.Router();

var _require = require("./userController"),
    validationAndSignUp = _require.validationAndSignUp,
    validationAndLogin = _require.validationAndLogin,
    getMyProfile = _require.getMyProfile,
    userrole = _require.userrole,
    getallUsers = _require.getallUsers,
    updateUserName = _require.updateUserName,
    updateParentsInfo = _require.updateParentsInfo,
    updateContractInfo = _require.updateContractInfo,
    updatePassword = _require.updatePassword,
    updateActive = _require.updateActive,
    updateUserRequest = _require.updateUserRequest,
    logoutUser = _require.logoutUser,
    adminSignup = _require.adminSignup,
    profileSignup = _require.profileSignup,
    createCourse = _require.createCourse,
    getAll = _require.getAll,
    resetPassword = _require.resetPassword,
    getTeachersCourseList = _require.getTeachersCourseList,
    registrationComplete = _require.registrationComplete,
    getCourseById = _require.getCourseById,
    getStudentCourse = _require.getStudentCourse,
    getMyProfileAndCourse = _require.getMyProfileAndCourse,
    updateProfile = _require.updateProfile;

var _require2 = require("../middleware/userMiddleware"),
    userauthorization = _require2.userauthorization; //admin registration


router.route("/admin-singup").post(adminSignup);
router.route("/admin/teacher-register").post(userauthorization, userrole("admin"), profileSignup("teacher")); // router
// 	.route("/admin/create-course")
// 	.post(userauthorization, userrole("admin"), createCourse);
//get teachers based on role

router.route("/admin/get-teachers").get(userauthorization, userrole("admin"), getAll("teacher"));
router.route("/admin/get-students").get(userauthorization, userrole("admin"), getAll("student")); //for all

router.route("/login").post(validationAndLogin);
router.route("/signup").post(validationAndSignUp);
router.route("/reset-password").post(resetPassword);
router.route("/get-me").get(userauthorization, getMyProfile); //student get profile and course

router.route("/get-profile-and-course").get(userauthorization, getMyProfileAndCourse);
router.route("/get-all").get(userauthorization, userrole("admin"), getallUsers);
router.route("/update-password").patch(userauthorization, updatePassword);
router.route("/deactive-me").patch(userauthorization, updateActive);
router.route("/update-request").patch(userauthorization, userrole("admin"), updateUserRequest);
router.route("/logout").post(userauthorization, logoutUser);
router.route("/update-profile").patch(userauthorization, updateProfile); //teacher work
//acount verify registrationComplete
// /user/account-verify

router.route("/user/account-verify").patch(registrationComplete);
router.route("/user/get-course-for-one").get(userauthorization, userrole("teacher"), getTeachersCourseList);
router.route("/teacher/course/:courseId").get(userauthorization, userrole("teacher"), getCourseById);
router.route("/student/get-course").get(userauthorization, userrole("student"), getStudentCourse);
module.exports = router;