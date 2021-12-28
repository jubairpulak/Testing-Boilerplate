"use strict";

var dot = require("dot-object");

var bcryptjs = require("bcryptjs");

var _ = require("lodash");

var catchAsync = require("../error/catchAsync");

var AppError = require("../error/appError");

var _require = require("../services/passwordBcrypt"),
    passwordBcrypt = _require.passwordBcrypt,
    comparePassword = _require.comparePassword; // const {checkValidation} = require("../services/validationService")


var ValidationCheck = require("../services/validationUsingClass");

var AuthService = require("../services/authService");

var UserModel = require("../users/userModel");

var _require2 = require("../util/tokenRelated"),
    createToken = _require2.createToken;

var _require3 = require("../error/ErrorSender"),
    SendErrorResponse = _require3.SendErrorResponse;

var sendEmail = require("../util/email");

var courseModel = require("../courses/courseModel");

var universeModel = require("../universes/universeModel");

var teamsModel = require("../Teams/teamsModel"); // send email


var Emailservice = function Emailservice(req, lastpartofurl, user, next, res) {
  var resetURL, msg;
  return regeneratorRuntime.async(function Emailservice$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          resetURL = "".concat(req.protocol, "://").concat(req.get("host"), "/api/user/reset-password?email=").concat(user.email, "&token=").concat(lastpartofurl);
          console.log("reset url ", resetURL); // let message = `Please use this token ${lastpartofurl} to complete further process`;

          msg = "Please click on this link  ".concat(resetURL, " to complete further process");
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(sendEmail({
            email: user.email,
            subject: "Complete your account registration",
            message: msg
          }));

        case 6:
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](3);
          console.log(_context.t0);
          return _context.abrupt("return", next(new AppError("There was an error sending email, try later", 500)));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 8]]);
};

var regComplete = function regComplete(email, role, req, res, next) {
  var completeRegistration, userWithToken;
  return regeneratorRuntime.async(function regComplete$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(UserModel.create({
            email: email,
            role: role
          }));

        case 2:
          completeRegistration = _context2.sent;
          userWithToken = completeRegistration.createAccountActivateToken();
          _context2.next = 6;
          return regeneratorRuntime.awrap(completeRegistration.save({
            runValidators: false
          }));

        case 6:
          Emailservice(req, userWithToken, completeRegistration, next, res);
          res.status(201).json({
            status: "success",
            message: "A account has been created for ".concat(completeRegistration.email, ". ")
          });

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.validationAndSignUp = catchAsync(function _callee(req, res, next) {
  var IsFirstNameNotValid, IsLastNameNotValid, IsPasswordNotValid, IsConfirmPasswordNotValidandNotMatched, IsPhoneNumberValid, IsEmailValid, IsFatherNameNotValid, IsMotherNameNotValid, UserSignUp;
  return regeneratorRuntime.async(function _callee$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          //checkfirstname
          IsFirstNameNotValid = new ValidationCheck(req.body.first_Name, "First Name").IsEmpty().print();

          if (!IsFirstNameNotValid) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", SendErrorResponse(IsFirstNameNotValid, 400, next));

        case 3:
          //lastNamecheck
          IsLastNameNotValid = new ValidationCheck(req.body.last_Name, "Last Name").IsEmpty().print();

          if (!IsLastNameNotValid) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", SendErrorResponse(IsLastNameNotValid, 400, next));

        case 6:
          //checkpassword
          IsPasswordNotValid = new ValidationCheck(req.body.password, "Password").IsEmpty().IsLowerThanMin(6).print();

          if (!IsPasswordNotValid) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", SendErrorResponse(IsPasswordNotValid, 400, next));

        case 9:
          //checkconfirmPassword and validity
          IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(req.body.confirmPassword, "Confirm Password").IsEmpty().IsLowerThanMin(6).IsPasswordMatched(req.body.password).print();

          if (!IsConfirmPasswordNotValidandNotMatched) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", SendErrorResponse(IsConfirmPasswordNotValidandNotMatched, 400, next));

        case 12:
          //checkC
          //phoneField CHeck
          IsPhoneNumberValid = new ValidationCheck(req.body.phone_Number, "Phone_Number").IsEmpty().IsString().IsLowerThanMin(11).IsLargerThanMax(12).print();

          if (!IsPhoneNumberValid) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", SendErrorResponse(IsPhoneNumberValid, 400, next));

        case 15:
          //checkemail
          IsEmailValid = new ValidationCheck(req.body.email, "Email").IsEmpty().IsEmail().print();

          if (!IsEmailValid) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", SendErrorResponse(IsEmailValid, 400, next));

        case 18:
          IsFatherNameNotValid = new ValidationCheck(req.body.father_Name, "Father Name").IsEmpty().print();

          if (!IsFatherNameNotValid) {
            _context3.next = 21;
            break;
          }

          return _context3.abrupt("return", SendErrorResponse(IsFatherNameNotValid, 400, next));

        case 21:
          IsMotherNameNotValid = new ValidationCheck(req.body.mother_Name, "Mother Name").IsEmpty().print();

          if (!IsMotherNameNotValid) {
            _context3.next = 24;
            break;
          }

          return _context3.abrupt("return", SendErrorResponse(IsMotherNameNotValid, 400, next));

        case 24:
          _context3.next = 26;
          return regeneratorRuntime.awrap(new AuthService(UserModel).SignUp(req.body));

        case 26:
          UserSignUp = _context3.sent;

          if (!(UserSignUp.error === true)) {
            _context3.next = 31;
            break;
          }

          return _context3.abrupt("return", next(new AppError(UserSignUp.ErrorMessage, UserSignUp.code)));

        case 31:
          console.log("UserSignUp.data._id :", UserSignUp.data.userid);
          res.status(201).json({
            status: "success",
            message: "Account registered",
            token: createToken(UserSignUp.data.userid, req, res)
          });

        case 33:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.validationAndLogin = catchAsync(function _callee2(req, res, next) {
  var IsEmailValid, IsPasswordNotValid, UserLogin, data;
  return regeneratorRuntime.async(function _callee2$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          /*
          Isempty () -> check email is empty
          IsEmail() -> check is email or not
          print() -> get result
          */
          IsEmailValid = new ValidationCheck(req.body.email, "Email").IsEmpty().IsEmail().print();

          if (!IsEmailValid) {
            _context4.next = 3;
            break;
          }

          return _context4.abrupt("return", SendErrorResponse(IsEmailValid, 400, next));

        case 3:
          //checkpassword
          IsPasswordNotValid = new ValidationCheck(req.body.password, "Password").IsEmpty().IsLowerThanMin(6).print();

          if (!IsPasswordNotValid) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", SendErrorResponse(IsPasswordNotValid, 400, next));

        case 6:
          _context4.next = 8;
          return regeneratorRuntime.awrap(new AuthService(UserModel).Login(req.body));

        case 8:
          UserLogin = _context4.sent;

          if (!(UserLogin.error === true)) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", next(new AppError(UserLogin.notfoundmessage, UserLogin.code)));

        case 13:
          data = UserLogin.data;
          res.status(201).json({
            status: "success",
            message: "Login Successfully",
            token: createToken(UserLogin.data._id, req, res),
            data: data
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.getMyProfile = catchAsync(function _callee3(req, res, next) {
  var getProfile;
  return regeneratorRuntime.async(function _callee3$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(new AuthService(UserModel).findMe(req.user.userid));

        case 2:
          getProfile = _context5.sent;
          console.log(getProfile);
          res.status(201).json({
            getProfile: getProfile
          });

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
});

exports.userrole = function () {
  for (var _len = arguments.length, restrictedTo = new Array(_len), _key = 0; _key < _len; _key++) {
    restrictedTo[_key] = arguments[_key];
  }

  return catchAsync(function _callee4(req, res, next) {
    var getUserRole;
    return regeneratorRuntime.async(function _callee4$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            console.log("data user", restrictedTo);
            _context6.next = 3;
            return regeneratorRuntime.awrap(new AuthService(UserModel).findUserWithRole(req.user.userid, restrictedTo, "lastName"));

          case 3:
            getUserRole = _context6.sent;
            getUserRole ? next() : res.status(403).send("You are not allowed");

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    });
  });
};

exports.getallUsers = catchAsync(function _callee5(req, res, next) {
  var getUserList;
  return regeneratorRuntime.async(function _callee5$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(new AuthService(UserModel).getAllData());

        case 2:
          getUserList = _context7.sent;
          res.status(201).json({
            length: getUserList.length,
            data: {
              getUserList: getUserList
            }
          });

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
});
exports.updateUserName = catchAsync(function _callee6(req, res, next) {
  var IsFirstNameNotValid, IsLastNameNotValid, finaldata, UpdateallThese;
  return regeneratorRuntime.async(function _callee6$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          //checkfirstname
          IsFirstNameNotValid = new ValidationCheck(req.body.first_Name, "First Name").IsEmpty().IsString().print();

          if (!IsFirstNameNotValid) {
            _context8.next = 3;
            break;
          }

          return _context8.abrupt("return", SendErrorResponse(IsFirstNameNotValid, 400, next));

        case 3:
          //lastNamecheck
          IsLastNameNotValid = new ValidationCheck(req.body.last_Name, "Last Name").IsEmpty().IsString().print();

          if (!IsLastNameNotValid) {
            _context8.next = 6;
            break;
          }

          return _context8.abrupt("return", SendErrorResponse(IsLastNameNotValid, 400, next));

        case 6:
          finaldata = _.pick(req.body, ["first_Name", "last_Name"]);
          _context8.next = 9;
          return regeneratorRuntime.awrap(new AuthService(UserModel).updateInfo(req.user.userid, req.body, finaldata));

        case 9:
          UpdateallThese = _context8.sent;
          console.log(req.body);
          res.status(201).json({
            status: "success",
            message: "Data Update Successfully",
            data: {
              UpdateallThese: UpdateallThese
            }
          });

        case 12:
        case "end":
          return _context8.stop();
      }
    }
  });
});
exports.updateParentsInfo = catchAsync(function _callee7(req, res, next) {
  var _req$body$parents_Inf, father_Name, mother_Name, IsFatherNameNotValid, IsMotherNameNotValid, objbeforedot, finaldata, UpdateallThese;

  return regeneratorRuntime.async(function _callee7$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body$parents_Inf = req.body.parents_Info, father_Name = _req$body$parents_Inf.father_Name, mother_Name = _req$body$parents_Inf.mother_Name;
          IsFatherNameNotValid = new ValidationCheck(father_Name, "Father Name").IsEmpty().print();

          if (!IsFatherNameNotValid) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", SendErrorResponse(IsFatherNameNotValid, 400, next));

        case 4:
          IsMotherNameNotValid = new ValidationCheck(mother_Name, "Mother Name").IsEmpty().print();

          if (!IsMotherNameNotValid) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", SendErrorResponse(IsMotherNameNotValid, 400, next));

        case 7:
          objbeforedot = _.pick(req.body, ["parents_Info.father_Name"]);
          finaldata = dot.dot(objbeforedot);
          _context9.next = 11;
          return regeneratorRuntime.awrap(new AuthService(UserModel).updateInfo(req.user.userid, finaldata));

        case 11:
          UpdateallThese = _context9.sent;
          res.status(201).json({
            status: "success",
            message: "Profile Name Updated Successfully",
            data: {
              UpdateallThese: UpdateallThese
            }
          });

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  });
});
exports.updateContractInfo = catchAsync(function _callee8(req, res, next) {
  var IsPhoneNumberValid, objbeforedot, finaldata, UpdateallThese;
  return regeneratorRuntime.async(function _callee8$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          //phoneField CHeck
          console.log("body data ", req.body.contract_Info.phone_Number);
          IsPhoneNumberValid = new ValidationCheck(req.body.contract_Info.phone_Number, "Phone_Number").IsEmpty().IsString().IsLowerThanMin(11).IsLargerThanMax(12).print();

          if (!IsPhoneNumberValid) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", SendErrorResponse(IsPhoneNumberValid, 400, next));

        case 4:
          objbeforedot = _.pick(req.body, ["contract_Info.phone_Number"]);
          finaldata = dot.dot(objbeforedot);
          _context10.next = 8;
          return regeneratorRuntime.awrap(new AuthService(UserModel).updateInfo(req.user.userid, finaldata));

        case 8:
          UpdateallThese = _context10.sent;
          res.status(201).json({
            status: "success",
            message: "Contract Information updated Successfully",
            data: {
              UpdateallThese: UpdateallThese
            }
          });

        case 10:
        case "end":
          return _context10.stop();
      }
    }
  });
});
exports.updatePassword = catchAsync(function _callee9(req, res, next) {
  var IsCurrentPassworNotValid, checkcurrentPassword, IsPasswordNotValid, IsConfirmPasswordNotValidandNotMatched, finaldata, UpdateallThese;
  return regeneratorRuntime.async(function _callee9$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          IsCurrentPassworNotValid = new ValidationCheck(req.body.currentPassword, "Current Password").IsEmpty().IsLowerThanMin(6).print();

          if (!IsCurrentPassworNotValid) {
            _context11.next = 3;
            break;
          }

          return _context11.abrupt("return", SendErrorResponse(IsCurrentPassworNotValid, 400, next));

        case 3:
          _context11.next = 5;
          return regeneratorRuntime.awrap(new AuthService(UserModel).checkCurrentPassword(req.user.userid, req.body.currentPassword));

        case 5:
          checkcurrentPassword = _context11.sent;
          console.log("wrong info :", checkcurrentPassword);

          if (!(checkcurrentPassword.error === true)) {
            _context11.next = 9;
            break;
          }

          return _context11.abrupt("return", next(new AppError(checkcurrentPassword.notfoundmessage, checkcurrentPassword.code)));

        case 9:
          //checkpassword
          IsPasswordNotValid = new ValidationCheck(req.body.password, "Password").IsEmpty().IsLowerThanMin(6).print();

          if (!IsPasswordNotValid) {
            _context11.next = 12;
            break;
          }

          return _context11.abrupt("return", SendErrorResponse(IsPasswordNotValid, 400, next));

        case 12:
          //checkconfirmPassword and validity
          IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(req.body.confirmPassword, "Confirm Password").IsEmpty().IsPasswordMatched(req.body.password).print();

          if (!IsConfirmPasswordNotValidandNotMatched) {
            _context11.next = 15;
            break;
          }

          return _context11.abrupt("return", SendErrorResponse(IsConfirmPasswordNotValidandNotMatched, 400, next));

        case 15:
          _context11.next = 17;
          return regeneratorRuntime.awrap(bcryptjs.hash(req.body.password, 12));

        case 17:
          req.body.password = _context11.sent;
          finaldata = _.pick(req.body, ["password"]);
          _context11.next = 21;
          return regeneratorRuntime.awrap(new AuthService(UserModel).updateInfo(req.user.userid, finaldata));

        case 21:
          UpdateallThese = _context11.sent;
          res.status(201).json({
            status: "success",
            message: "Password updated Successfully",
            data: {
              UpdateallThese: UpdateallThese
            }
          });

        case 23:
        case "end":
          return _context11.stop();
      }
    }
  });
});
exports.updateActive = catchAsync(function _callee10(req, res, next) {
  var DeactiveUser;
  return regeneratorRuntime.async(function _callee10$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(new AuthService(UserModel).updateRole(req.user.userid));

        case 2:
          DeactiveUser = _context12.sent;
          res.cookie("jwt", "loggedout", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
          });
          res.status(201).json({
            status: "success",
            message: DeactiveUser
          });

        case 5:
        case "end":
          return _context12.stop();
      }
    }
  });
});
exports.updateUserRequest = catchAsync(function _callee11(req, res, next) {
  var UpdateAccont;
  return regeneratorRuntime.async(function _callee11$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(new AuthService(UserModel).updateRequest(req.body.email));

        case 2:
          UpdateAccont = _context13.sent;
          res.status(201).json({
            status: "success",
            message: UpdateAccont
          });

        case 4:
        case "end":
          return _context13.stop();
      }
    }
  });
});
exports.logoutUser = catchAsync(function _callee12(req, res, next) {
  return regeneratorRuntime.async(function _callee12$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          res.cookie("jwt", "loggedout", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
          });
          res.status(201).json({
            status: "success",
            message: "You have logged out"
          });

        case 2:
        case "end":
          return _context14.stop();
      }
    }
  });
});
/*
take data from admin
if not available email create accunt and return token
*/

exports.adminSignup = catchAsync(function _callee13(req, res, next) {
  var _req$body, email, password, firstName, lastName, phoneNumber, confirmPassword, IsFirstNameNotValid, IsLastNameNotValid, IsPasswordNotValid, IsConfirmPasswordNotValidandNotMatched, IsPhoneNumberValid, IsEmailValid, CheckEmail, CheckPhone, createService;

  return regeneratorRuntime.async(function _callee13$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password, firstName = _req$body.firstName, lastName = _req$body.lastName, phoneNumber = _req$body.phoneNumber, confirmPassword = _req$body.confirmPassword; //checkfirstname

          IsFirstNameNotValid = new ValidationCheck(req.body.firstName, "First Name").IsEmpty().print();

          if (!IsFirstNameNotValid) {
            _context15.next = 4;
            break;
          }

          return _context15.abrupt("return", SendErrorResponse(IsFirstNameNotValid, 400, next));

        case 4:
          //lastNamecheck
          IsLastNameNotValid = new ValidationCheck(req.body.lastName, "Last Name").IsEmpty().print();

          if (!IsLastNameNotValid) {
            _context15.next = 7;
            break;
          }

          return _context15.abrupt("return", SendErrorResponse(IsLastNameNotValid, 400, next));

        case 7:
          //checkpassword
          IsPasswordNotValid = new ValidationCheck(req.body.password, "Password").IsEmpty().IsLowerThanMin(6).print();

          if (!IsPasswordNotValid) {
            _context15.next = 10;
            break;
          }

          return _context15.abrupt("return", SendErrorResponse(IsPasswordNotValid, 400, next));

        case 10:
          //checkconfirmPassword and validity
          IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(req.body.confirmPassword, "Confirm Password").IsEmpty().IsLowerThanMin(6).IsPasswordMatched(req.body.password).print();

          if (!IsConfirmPasswordNotValidandNotMatched) {
            _context15.next = 13;
            break;
          }

          return _context15.abrupt("return", SendErrorResponse(IsConfirmPasswordNotValidandNotMatched, 400, next));

        case 13:
          //checkC
          //phoneField CHeck
          IsPhoneNumberValid = new ValidationCheck(req.body.phoneNumber, "Phone_Number").IsEmpty().IsString().IsLowerThanMin(11).IsLargerThanMax(12).print();

          if (!IsPhoneNumberValid) {
            _context15.next = 16;
            break;
          }

          return _context15.abrupt("return", SendErrorResponse(IsPhoneNumberValid, 400, next));

        case 16:
          //checkemail
          IsEmailValid = new ValidationCheck(req.body.email, "Email").IsEmpty().IsEmail().print();

          if (!IsEmailValid) {
            _context15.next = 19;
            break;
          }

          return _context15.abrupt("return", SendErrorResponse(IsEmailValid, 400, next));

        case 19:
          _context15.next = 21;
          return regeneratorRuntime.awrap(new AuthService(UserModel).isEmailExist(req.body.email));

        case 21:
          CheckEmail = _context15.sent;
          console.log("hello email", CheckEmail);

          if (!(CheckEmail.error == true)) {
            _context15.next = 25;
            break;
          }

          return _context15.abrupt("return", SendErrorResponse(CheckEmail.message, CheckEmail.code, next));

        case 25:
          _context15.next = 27;
          return regeneratorRuntime.awrap(new AuthService(UserModel).isPhoneExist(req.body.phoneNumber));

        case 27:
          CheckPhone = _context15.sent;

          if (!(CheckPhone.error == true)) {
            _context15.next = 30;
            break;
          }

          return _context15.abrupt("return", SendErrorResponse(CheckPhone.message, CheckPhone.code, next));

        case 30:
          _context15.next = 32;
          return regeneratorRuntime.awrap(passwordBcrypt(password));

        case 32:
          password = _context15.sent;
          _context15.next = 35;
          return regeneratorRuntime.awrap(UserModel.create({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            request: "active"
          }));

        case 35:
          createService = _context15.sent;

          if (createService) {
            _context15.next = 38;
            break;
          }

          return _context15.abrupt("return", res.status(401).json({
            status: "fail",
            message: "Account is not created"
          }));

        case 38:
          res.status(201).json({
            status: "success",
            message: "Congratulation!, Your account has been registered",
            token: createToken(createService._id, req, res)
          });

        case 39:
        case "end":
          return _context15.stop();
      }
    }
  });
});

exports.profileSignup = function (role) {
  return catchAsync(function _callee14(req, res, next) {
    var IsEmailValid, CheckEmail, email, completeReg;
    return regeneratorRuntime.async(function _callee14$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            IsEmailValid = new ValidationCheck(req.body.email, "Email").IsEmpty().IsEmail().print();

            if (!IsEmailValid) {
              _context16.next = 3;
              break;
            }

            return _context16.abrupt("return", SendErrorResponse(IsEmailValid, 400, next));

          case 3:
            console.log("hello role", role);
            _context16.next = 6;
            return regeneratorRuntime.awrap(new AuthService(UserModel).isEmailExist(req.body.email));

          case 6:
            CheckEmail = _context16.sent;

            if (!(CheckEmail.error == true)) {
              _context16.next = 9;
              break;
            }

            return _context16.abrupt("return", SendErrorResponse(CheckEmail.message, CheckEmail.code, next));

          case 9:
            console.log("hello from 548");
            email = req.body.email;
            completeReg = regComplete(email, role, req, res, next);

          case 12:
          case "end":
            return _context16.stop();
        }
      }
    });
  });
};

exports.getAll = function (role) {
  return catchAsync(function _callee15(req, res, next) {
    var getListOfDatas;
    return regeneratorRuntime.async(function _callee15$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return regeneratorRuntime.awrap(new AuthService(UserModel).getAll(role));

          case 2:
            getListOfDatas = _context17.sent;
            res.status(201).json({
              status: "success",
              length: getListOfDatas.length,
              getListOfDatas: getListOfDatas
            });

          case 4:
          case "end":
            return _context17.stop();
        }
      }
    });
  });
};

exports.resetPassword = catchAsync(function _callee16(req, res, next) {
  var _req$body2, password, confirmPassword, email, IsPasswordNotValid, IsConfirmPasswordNotValidandNotMatched, IsEmailNotValid, isUserFound, user;

  return regeneratorRuntime.async(function _callee16$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _req$body2 = req.body, password = _req$body2.password, confirmPassword = _req$body2.confirmPassword, email = _req$body2.email; //checkpassword

          IsPasswordNotValid = new ValidationCheck(password, "Password").IsEmpty().IsLowerThanMin(6).print();

          if (!IsPasswordNotValid) {
            _context18.next = 4;
            break;
          }

          return _context18.abrupt("return", SendErrorResponse(IsPasswordNotValid, 400, next));

        case 4:
          //checkconfirmPassword and validity
          IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(confirmPassword, "Confirm Password").IsEmpty().IsLowerThanMin(6).IsPasswordMatched(req.body.password).print();

          if (!IsConfirmPasswordNotValidandNotMatched) {
            _context18.next = 7;
            break;
          }

          return _context18.abrupt("return", SendErrorResponse(IsConfirmPasswordNotValidandNotMatched, 400, next));

        case 7:
          //check email
          IsEmailNotValid = new ValidationCheck(email, "Email").IsEmpty().IsEmail().print();

          if (!IsEmailNotValid) {
            _context18.next = 10;
            break;
          }

          return _context18.abrupt("return", SendErrorResponse(IsEmailNotValid, 400, next));

        case 10:
          _context18.next = 12;
          return regeneratorRuntime.awrap(new AuthService(UserModel).isUserExist(email));

        case 12:
          isUserFound = _context18.sent;
          console.log("user data", isUserFound);

          if (!(isUserFound.code == false)) {
            _context18.next = 18;
            break;
          }

          res.status(404).json({
            status: "fail",
            message: "email is not existed"
          });
          _context18.next = 26;
          break;

        case 18:
          user = isUserFound.user;
          _context18.next = 21;
          return regeneratorRuntime.awrap(passwordBcrypt(password));

        case 21:
          user.password = _context18.sent;
          console.log("user data", user);
          _context18.next = 25;
          return regeneratorRuntime.awrap(user.save());

        case 25:
          res.status(201).json({
            status: "success",
            user: user,
            token: createToken(user._id, req, res)
          });

        case 26:
        case "end":
          return _context18.stop();
      }
    }
  });
});
exports.getTeachersCourseList = catchAsync(function _callee17(req, res, next) {
  var findAllCourseList;
  return regeneratorRuntime.async(function _callee17$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.next = 2;
          return regeneratorRuntime.awrap(courseModel.find({
            courseLeader: req.user.userid
          }));

        case 2:
          findAllCourseList = _context19.sent;
          res.status(201).json({
            status: "success",
            findAllCourseList: findAllCourseList
          });

        case 4:
        case "end":
          return _context19.stop();
      }
    }
  });
});
exports.registrationComplete = catchAsync(function _callee18(req, res, next) {
  var _req$body3, accountActivateToken, email, password, confirmPassword, IsPasswordNotValid, IsConfirmPasswordNotValidandNotMatched, value, IsEmailExist;

  return regeneratorRuntime.async(function _callee18$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _req$body3 = req.body, accountActivateToken = _req$body3.accountActivateToken, email = _req$body3.email, password = _req$body3.password, confirmPassword = _req$body3.confirmPassword; //checkpassword

          IsPasswordNotValid = new ValidationCheck(password, "Password").IsEmpty().IsLowerThanMin(6).print();

          if (!IsPasswordNotValid) {
            _context20.next = 4;
            break;
          }

          return _context20.abrupt("return", SendErrorResponse(IsPasswordNotValid, 400, next));

        case 4:
          //checkconfirmPassword and validity
          IsConfirmPasswordNotValidandNotMatched = new ValidationCheck(confirmPassword, "Confirm Password").IsEmpty().IsLowerThanMin(6).IsPasswordMatched(req.body.password).print();

          if (!IsConfirmPasswordNotValidandNotMatched) {
            _context20.next = 7;
            break;
          }

          return _context20.abrupt("return", SendErrorResponse(IsConfirmPasswordNotValidandNotMatched, 400, next));

        case 7:
          value = {};
          value.email = email;
          _context20.next = 11;
          return regeneratorRuntime.awrap(new AuthService(UserModel).isDataExist(value));

        case 11:
          IsEmailExist = _context20.sent;

          if (!(IsEmailExist.error == false)) {
            _context20.next = 15;
            break;
          }

          console.log("Wrong from 637");
          return _context20.abrupt("return", SendErrorResponse("URL not valid", 404, next));

        case 15:
          if (!(IsEmailExist.data.accountActivateToken != accountActivateToken)) {
            _context20.next = 18;
            break;
          }

          console.log("wrong from 676");
          return _context20.abrupt("return", SendErrorResponse("URL not valid", 404, next));

        case 18:
          _context20.next = 20;
          return regeneratorRuntime.awrap(passwordBcrypt(password));

        case 20:
          IsEmailExist.data.password = _context20.sent;
          IsEmailExist.data.accountActivateToken = undefined;
          IsEmailExist.data.request = "active";
          console.log("user data", IsEmailExist);
          _context20.next = 26;
          return regeneratorRuntime.awrap(IsEmailExist.data.save());

        case 26:
          res.status(201).json({
            status: "success",
            user: IsEmailExist.data,
            token: createToken(IsEmailExist.data._id, req, res)
          });

        case 27:
        case "end":
          return _context20.stop();
      }
    }
  });
});
exports.getCourseById = catchAsync(function _callee19(req, res, next) {
  var findCourse;
  return regeneratorRuntime.async(function _callee19$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.next = 2;
          return regeneratorRuntime.awrap(courseModel.findById(req.params.courseId).lean());

        case 2:
          findCourse = _context21.sent;
          res.status(201).json({
            status: "success",
            findCourse: findCourse
          });

        case 4:
        case "end":
          return _context21.stop();
      }
    }
  });
});
exports.getStudentCourse = catchAsync(function _callee20(req, res, next) {
  var findUser;
  return regeneratorRuntime.async(function _callee20$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.next = 2;
          return regeneratorRuntime.awrap(UserModel.findById(req.user.userid));

        case 2:
          findUser = _context22.sent;
          console.log("Course Student data", findUser);

        case 4:
        case "end":
          return _context22.stop();
      }
    }
  });
});
exports.getMyProfileAndCourse = catchAsync(function _callee21(req, res, next) {
  var findUser, findTeamData, findUniverseData;
  return regeneratorRuntime.async(function _callee21$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.next = 2;
          return regeneratorRuntime.awrap(UserModel.findById(req.user.userid));

        case 2:
          findUser = _context23.sent;
          _context23.next = 5;
          return regeneratorRuntime.awrap(teamsModel.find({
            students: req.user.userid
          }).populate({
            path: "students",
            select: "email"
          }).populate({
            path: "universe",
            select: "_id universeName"
          }));

        case 5:
          findTeamData = _context23.sent;
          console.log("Team Name and data", findTeamData);
          _context23.next = 9;
          return regeneratorRuntime.awrap(universeModel.findById(findUser.universe).populate({
            path: "course",
            select: "courseName"
          }).populate({
            path: "courseLeader",
            select: "firstName email"
          }).select("+course +courseLeader +courseLeader -studentLimit  -teamLimit  -studentLimitCount -teamCount -teamLimitCount"));

        case 9:
          findUniverseData = _context23.sent;
          console.log("find Universe Data here", findUser);
          res.status(201).json({
            status: "success",
            findUniverseData: findUniverseData,
            findTeamData: findTeamData
          });

        case 12:
        case "end":
          return _context23.stop();
      }
    }
  });
});
exports.updateProfile = catchAsync(function _callee22(req, res, next) {
  var IsFirstNameNotValid, IsLastNameNotValid, IsPhoneNumberValid, updateProfileData, UpdateUserProfileData;
  return regeneratorRuntime.async(function _callee22$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          //checkfirstname
          IsFirstNameNotValid = new ValidationCheck(req.body.first_Name, "First Name").IsEmpty().print();

          if (!IsFirstNameNotValid) {
            _context24.next = 3;
            break;
          }

          return _context24.abrupt("return", SendErrorResponse(IsFirstNameNotValid, 400, next));

        case 3:
          //lastNamecheck
          IsLastNameNotValid = new ValidationCheck(req.body.last_Name, "Last Name").IsEmpty().print();

          if (!IsLastNameNotValid) {
            _context24.next = 6;
            break;
          }

          return _context24.abrupt("return", SendErrorResponse(IsLastNameNotValid, 400, next));

        case 6:
          //phoneField CHeck
          IsPhoneNumberValid = new ValidationCheck(req.body.phone_Number, "Phone_Number").IsEmpty().IsString().IsLowerThanMin(11).IsLargerThanMax(12).print();

          if (!IsPhoneNumberValid) {
            _context24.next = 9;
            break;
          }

          return _context24.abrupt("return", SendErrorResponse(IsPhoneNumberValid, 400, next));

        case 9:
          updateProfileData = _.pick(req.body, ["first_Name", "last_Name", "phone_Number"]);
          _context24.next = 12;
          return regeneratorRuntime.awrap(new AuthService(UserModel).updateInfo(req.user.userid, updateProfileData));

        case 12:
          UpdateUserProfileData = _context24.sent;
          res.status(201).json({
            status: "success",
            message: "Profile has been updated Successfully",
            data: {
              UpdateUserProfileData: UpdateUserProfileData
            }
          });

        case 14:
        case "end":
          return _context24.stop();
      }
    }
  });
});