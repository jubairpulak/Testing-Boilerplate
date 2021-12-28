"use strict";

var fs = require("fs");

var mongoose = require("mongoose");

var catchAsync = require("../error/catchAsync");

var path = require("path"); //for local


var dotenv = require("dotenv");

dotenv.config({
  path: "../.config"
});

exports.dbConnection = function _callee() {
  var connectionOptions;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // //for local
          // const connectionOptions = {
          //   useNewUrlParser: true,
          //   useCreateIndex: true,
          //   useFindAndModify: false,
          //   useUnifiedTopology: true,
          // }
          // for statging
          connectionOptions = {
            ssl: true,
            sslValidate: true,
            sslCA: fs.readFileSync(require("path").resolve(__dirname, "../ca-certificate.crt")),
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            autoIndex: true
          };
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(mongoose.connect(process.env.DB_URI, connectionOptions));

        case 4:
          console.log("connect ...");
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          console.log("DB not connected", _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
};