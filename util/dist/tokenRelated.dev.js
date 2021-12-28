"use strict";

var jwt = require("jsonwebtoken");

var config = require("../config");

var _config$token = config.token,
    token_Secret = _config$token.token_Secret,
    token_Expires = _config$token.token_Expires;

exports.createToken = function (userid, req, res) {
  console.log("user id data", userid);
  var token = jwt.sign({
    userid: userid
  }, token_Secret, {
    expiresIn: token_Expires
  });
  var cookieOptions = {
    expires: new Date(Date.now() + token_Expires * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https"
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  return token;
};