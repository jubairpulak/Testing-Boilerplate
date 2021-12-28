"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var bcryptjs = require("bcryptjs");

var _require = require("jslugify"),
    slugify = _require.slugify;

var comparePass = function comparePass(storepass, inputpass) {
  return regeneratorRuntime.async(function comparePass$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(bcryptjs.compare(inputpass, storepass));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

var AuthService =
/*#__PURE__*/
function () {
  function AuthService(Model) {
    _classCallCheck(this, AuthService);

    this.Model = Model;
  }

  _createClass(AuthService, [{
    key: "SignUp",
    value: function SignUp(DatafromBody) {
      var first_Name, last_Name, password, email, phone_Number, father_Name, mother_Name, address, CheckIsEmailExist, CheckIsPhoneExist, createUser;
      return regeneratorRuntime.async(function SignUp$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              first_Name = DatafromBody.first_Name, last_Name = DatafromBody.last_Name, password = DatafromBody.password, email = DatafromBody.email, phone_Number = DatafromBody.phone_Number, father_Name = DatafromBody.father_Name, mother_Name = DatafromBody.mother_Name, address = DatafromBody.address;
              _context2.next = 3;
              return regeneratorRuntime.awrap(this.Model.findOne({
                "contract_Info.email": email
              }).lean());

            case 3:
              CheckIsEmailExist = _context2.sent;
              _context2.next = 6;
              return regeneratorRuntime.awrap(this.Model.findOne({
                "contract_Info.phone_Number": phone_Number
              }).lean());

            case 6:
              CheckIsPhoneExist = _context2.sent;

              if (!CheckIsEmailExist) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("return", {
                ErrorMessage: "Email has already been used",
                code: 403,
                error: true
              });

            case 11:
              if (!CheckIsPhoneExist) {
                _context2.next = 15;
                break;
              }

              return _context2.abrupt("return", {
                ErrorMessage: "Phone Number has already been used",
                code: 403,
                error: true
              });

            case 15:
              _context2.t0 = regeneratorRuntime;
              _context2.t1 = this.Model;
              _context2.t2 = first_Name;
              _context2.t3 = last_Name;
              _context2.next = 21;
              return regeneratorRuntime.awrap(bcryptjs.hash(password, 12));

            case 21:
              _context2.t4 = _context2.sent;
              _context2.t5 = {
                email: email,
                phone_Number: phone_Number
              };
              _context2.t6 = {
                father_Name: father_Name,
                mother_Name: mother_Name
              };
              _context2.t7 = address;
              _context2.t8 = {
                first_Name: _context2.t2,
                last_Name: _context2.t3,
                password: _context2.t4,
                contract_Info: _context2.t5,
                parents_Info: _context2.t6,
                address: _context2.t7
              };
              _context2.t9 = _context2.t1.create.call(_context2.t1, _context2.t8);
              _context2.next = 29;
              return _context2.t0.awrap.call(_context2.t0, _context2.t9);

            case 29:
              createUser = _context2.sent;
              return _context2.abrupt("return", {
                error: false,
                data: {
                  userid: createUser._id
                }
              });

            case 31:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    } //login user

  }, {
    key: "Login",
    value: function Login(DatafromBody) {
      var email, password, findemail, passwordgenerate, checkActive;
      return regeneratorRuntime.async(function Login$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              email = DatafromBody.email, password = DatafromBody.password;
              console.log("data of email and pass", email, password);
              _context3.next = 4;
              return regeneratorRuntime.awrap(this.Model.findOne({
                email: email
              }).select("+password").lean());

            case 4:
              findemail = _context3.sent;

              if (findemail) {
                _context3.next = 7;
                break;
              }

              return _context3.abrupt("return", {
                notfoundmessage: "Email not found",
                code: 404,
                error: true
              });

            case 7:
              console.log("hello user data", findemail);
              _context3.next = 10;
              return regeneratorRuntime.awrap(comparePass(findemail.password, password));

            case 10:
              passwordgenerate = _context3.sent;

              if (passwordgenerate) {
                _context3.next = 13;
                break;
              }

              return _context3.abrupt("return", {
                notfoundmessage: "Invalid Password",
                code: 404,
                error: true
              });

            case 13:
              _context3.next = 15;
              return regeneratorRuntime.awrap(this.Model.findById({
                _id: findemail._id
              }).where({
                active: true
              }).lean());

            case 15:
              checkActive = _context3.sent;

              if (checkActive) {
                _context3.next = 18;
                break;
              }

              return _context3.abrupt("return", {
                notfoundmessage: "Account is deactivated",
                code: 403,
                error: true
              });

            case 18:
              return _context3.abrupt("return", {
                error: false,
                data: findemail
              });

            case 19:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "findMe",
    value: function findMe(userid) {
      return regeneratorRuntime.async(function findMe$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(this.Model.findById({
                _id: userid
              }).lean());

            case 2:
              return _context4.abrupt("return", _context4.sent);

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "findUserWithRole",
    value: function findUserWithRole(userid, role, variablename) {
      var data, findUser, v1;
      return regeneratorRuntime.async(function findUserWithRole$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              data = variablename;
              _context5.next = 3;
              return regeneratorRuntime.awrap(this.Model.findById({
                _id: userid
              }).lean());

            case 3:
              findUser = _context5.sent;
              v1 = findUser[data];
              console.log(v1);
              return _context5.abrupt("return", !role.includes(findUser.role) ? false : true);

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getAllData",
    value: function getAllData() {
      return regeneratorRuntime.async(function getAllData$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(this.Model.find({}).lean());

            case 2:
              return _context6.abrupt("return", _context6.sent);

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "checkCurrentPassword",
    value: function checkCurrentPassword(userid, currentPassword) {
      var findUser, passwordCheck;
      return regeneratorRuntime.async(function checkCurrentPassword$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(this.Model.findById({
                _id: userid
              }).select("+password").lean());

            case 2:
              findUser = _context7.sent;
              _context7.next = 5;
              return regeneratorRuntime.awrap(comparePass(findUser.password, currentPassword));

            case 5:
              passwordCheck = _context7.sent;

              if (passwordCheck) {
                _context7.next = 8;
                break;
              }

              return _context7.abrupt("return", {
                notfoundmessage: "Invalid Password",
                code: 404,
                error: true
              });

            case 8:
              return _context7.abrupt("return", "");

            case 9:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "updateInfo",
    value: function updateInfo(userid, updateobjectdata) {
      var updatedata;
      return regeneratorRuntime.async(function updateInfo$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return regeneratorRuntime.awrap(this.Model.findByIdAndUpdate({
                _id: userid
              }, updateobjectdata, {
                "new": true,
                runValidators: true
              }));

            case 2:
              updatedata = _context8.sent;
              console.log("log data", updatedata);
              return _context8.abrupt("return", updatedata);

            case 5:
            case "end":
              return _context8.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "updateRole",
    value: function updateRole(userid) {
      var updateUserActiveRole;
      return regeneratorRuntime.async(function updateRole$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return regeneratorRuntime.awrap(this.Model.findByIdAndUpdate({
                _id: userid
              }, {
                $set: {
                  active: false
                }
              }));

            case 2:
              updateUserActiveRole = _context9.sent;
              if (!updateUserActiveRole) console.log("No, something wrong");
              return _context9.abrupt("return", "Account has been deactivated successfully");

            case 5:
            case "end":
              return _context9.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "updateRequest",
    value: function updateRequest(email) {
      var updateUserActiveRole;
      return regeneratorRuntime.async(function updateRequest$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return regeneratorRuntime.awrap(this.Model.findOneAndUpdate({
                "contract_Info.email": email
              }, {
                request: "active"
              }, {
                "new": true,
                runValidators: true
              }));

            case 2:
              updateUserActiveRole = _context10.sent;
              if (!updateUserActiveRole) console.log("Account has not been updated");
              return _context10.abrupt("return", "Account has been Updated");

            case 5:
            case "end":
              return _context10.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "isEmailExist",
    value: function isEmailExist(email) {
      var findEmail;
      return regeneratorRuntime.async(function isEmailExist$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return regeneratorRuntime.awrap(this.Model.findOne({
                email: email
              }));

            case 2:
              findEmail = _context11.sent;

              if (!(!findEmail || findEmail == undefined || findEmail == null)) {
                _context11.next = 7;
                break;
              }

              return _context11.abrupt("return", {
                error: false
              });

            case 7:
              return _context11.abrupt("return", {
                message: "Email is already existed",
                error: true,
                code: "403"
              });

            case 8:
            case "end":
              return _context11.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "isUserExist",
    value: function isUserExist(email) {
      var findEmail;
      return regeneratorRuntime.async(function isUserExist$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return regeneratorRuntime.awrap(this.Model.findOne({
                email: email
              }));

            case 2:
              findEmail = _context12.sent;

              if (!(!findEmail || findEmail == undefined || findEmail == null)) {
                _context12.next = 7;
                break;
              }

              return _context12.abrupt("return", {
                error: false
              });

            case 7:
              return _context12.abrupt("return", {
                user: findEmail,
                error: true,
                code: "403"
              });

            case 8:
            case "end":
              return _context12.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "isPhoneExist",
    value: function isPhoneExist(phoneNumber) {
      var findPhone;
      return regeneratorRuntime.async(function isPhoneExist$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return regeneratorRuntime.awrap(this.Model.findOne({
                phoneNumber: phoneNumber
              }).lean());

            case 2:
              findPhone = _context13.sent;

              if (!(!findPhone || findPhone == undefined || findPhone == null)) {
                _context13.next = 7;
                break;
              }

              return _context13.abrupt("return", {
                error: false
              });

            case 7:
              return _context13.abrupt("return", {
                message: "Phone Number is already existed",
                error: true,
                code: "403"
              });

            case 8:
            case "end":
              return _context13.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "createData",
    value: function createData(objdata) {
      return regeneratorRuntime.async(function createData$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
            case "end":
              return _context14.stop();
          }
        }
      });
    }
  }, {
    key: "getAll",
    value: function getAll(role) {
      return regeneratorRuntime.async(function getAll$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              return _context15.abrupt("return", this.Model.find({
                role: role
              }).lean());

            case 1:
            case "end":
              return _context15.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "isDataFindById",
    value: function isDataFindById(id) {
      var data;
      return regeneratorRuntime.async(function isDataFindById$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return regeneratorRuntime.awrap(this.Model.findById(id));

            case 2:
              data = _context16.sent;
              console.log("data error", data);

              if (!(data < 1)) {
                _context16.next = 8;
                break;
              }

              return _context16.abrupt("return", {
                error: false
              });

            case 8:
              console.log("hello data", data.length);
              return _context16.abrupt("return", {
                error: true,
                data: data
              });

            case 10:
            case "end":
              return _context16.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "isDataExist",
    value: function isDataExist(obj) {
      var data;
      return regeneratorRuntime.async(function isDataExist$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              console.log("from 229 line0", obj);
              _context17.next = 3;
              return regeneratorRuntime.awrap(this.Model.findOne(obj));

            case 3:
              data = _context17.sent;

              if (!(data < 1)) {
                _context17.next = 8;
                break;
              }

              return _context17.abrupt("return", {
                error: false
              });

            case 8:
              console.log("hello data", data);
              return _context17.abrupt("return", {
                error: true,
                data: data
              });

            case 10:
            case "end":
              return _context17.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "makeSlugify",
    value: function makeSlugify(obj) {
      return regeneratorRuntime.async(function makeSlugify$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              return _context18.abrupt("return", slugify(obj, true, "-"));

            case 1:
            case "end":
              return _context18.stop();
          }
        }
      });
    }
  }, {
    key: "sendBulkData",
    value: function sendBulkData(obj) {
      var data;
      return regeneratorRuntime.async(function sendBulkData$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return regeneratorRuntime.awrap(this.Model.insertMany(obj));

            case 2:
              data = _context19.sent;

              if (data) {
                _context19.next = 7;
                break;
              }

              return _context19.abrupt("return", {
                status: "fail",
                error: true,
                message: "Data is not inserted"
              });

            case 7:
              return _context19.abrupt("return", {
                status: "success",
                error: false,
                message: "Data has been inserted"
              });

            case 8:
            case "end":
              return _context19.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getProductAndMarketData",
    value: function getProductAndMarketData(obj) {
      return regeneratorRuntime.async(function getProductAndMarketData$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              console.log("obj data here mongodb auth", obj);
              return _context20.abrupt("return", this.Model.find(obj).populate({
                path: "techDetails",
                populate: {
                  path: "techInfo",
                  populate: {
                    path: "tech",
                    select: "techName _id"
                  }
                }
              }).populate({
                path: "regionInfo",
                select: "regionName _id"
              }));

            case 2:
            case "end":
              return _context20.stop();
          }
        }
      }, null, this);
    }
  }]);

  return AuthService;
}();

module.exports = AuthService;