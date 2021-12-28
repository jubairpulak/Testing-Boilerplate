"use strict"

const fs = require("fs")
const mongoose = require("mongoose")
const catchAsync = require("../error/catchAsync")
const path = require("path")
//for local
const dotenv = require("dotenv")
dotenv.config({ path: "../.config" })

exports.dbConnection = async () => {
  // //for local
  const connectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
  // for statging
  // const connectionOptions = {
  //   ssl: true,
  //   sslValidate: true,
  //   sslCA: fs.readFileSync(
  //     require("path").resolve(__dirname, "../ca-certificate.crt")
  //   ),
  //   useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false,
  //   useUnifiedTopology: true,
  //   autoIndex: true,
  // }

  try {
    await mongoose.connect(process.env.DB_URI, connectionOptions)
    console.log("connect ...")
  } catch (err) {
    console.log("DB not connected", err)
  }
}
