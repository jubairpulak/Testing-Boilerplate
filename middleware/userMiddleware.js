"use strict"

const catchAsync = require("../error/catchAsync")
const config = require("../config")
const JWT = require("jsonwebtoken")
const { promisify } = require("util")
exports.userauthorization = catchAsync(async (req, res, next) => {
  const { token_Secret } = config.token
  let token

  // for postman
  // console.log("req header data", req.headers.authorization)
  // if (req.headers.authorization) {
  //   token = req.headers.authorization.split(" ")[1]
  // }
  console.log("token here", token)
  //for react
  if (req.headers) {
    token = req.headers.authtoken
  }
  console.log("token secret data", token_Secret)
  const decodeToken = await promisify(JWT.verify)(token, token_Secret)
  console.log("decode token", decodeToken)

  req.user = decodeToken
  next()
})
