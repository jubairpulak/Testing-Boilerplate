"use strict"

// //for developingstage
// const dotenv = require("dotenv")
// dotenv.config({ path: "./.env" })
const app = require("./app")
const { dbConnection } = require("./config/dbConnection")

const http = require("http")

process.on("uncaughtException", err => {
  console.log(err)
  console.log(err.name, err.message)
  console.log("Unhandler Rejection ! Shutting down...")
  process.exit(1)
})
//for developing stage
// const config = require("./config")
// // // for developing stage
// const { token_Secret, token_Expires } = config.token

// end here
let port = process.env.PORT || 5000

dbConnection()
console.log("your port is ", port)

// app.set("port", port)

const server = http.createServer(app)

const serverdata = app.listen(port)

process.on("unhandledRejection", err => {
  console.log(err.name, err.message)
  console.log("Unhandler Rejection ! Shutting down...")
  serverdata.close(() => {
    process.exit(1)
  })
})
