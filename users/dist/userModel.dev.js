"use strict";

var mongoose = require("mongoose");

var ObjectId = mongoose.Schema.ObjectId;
var UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    min: 6,
    select: false
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String,
    min: 11
  },
  role: {
    type: String,
    "default": "admin",
    "enum": ["admin", "teacher", "student"]
  },
  request: {
    type: String,
    "default": "pending",
    "enum": ["active", "pending", "block"]
  },
  active: {
    type: String,
    "default": "true",
    "enum": ["true", "false"]
  },
  address: {
    type: String
  },
  instituteName: String,
  major: String,
  course: [{
    type: ObjectId,
    ref: "CourseSchema"
  }],
  universe: {
    type: ObjectId,
    ref: "UniverseSchema"
  },
  team: [{
    type: ObjectId,
    ref: "TeamSchema"
  }],
  accountActivateToken: String
}, {
  timestamps: true
});
UserSchema.index({
  email: 1,
  password: 1
});

UserSchema.methods.createAccountActivateToken = function () {
  var token = Math.floor(100000 + Math.random() * 900000);
  this.accountActivateToken = token;
  console.log("after convert : ", this.accountActivateToken);
  return token;
};

UserSchema.pre("/^find/", function (next) {
  this.find({
    active: {
      $ne: "false"
    }
  });
  next();
});
module.exports = mongoose.model("UserSchema", UserSchema);