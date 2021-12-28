"use strict";

const express = require("express");

const pkginfo = require("pkginfo")(module, "license", "author", "name");
const bodyParser = require("body-parser");

const { errors } = require("celebrate");
const cors = require("cors");

// const { logger } = require("./logger");
const logger = require("morgan");
const rfs = require("rotating-file-stream");
const { join } = require("path");
const path = require("path");
const AppError = require("./error/appError");
const config = require("./config");

const app = express();
const UserRouter = require("./users/userRouter");
const globalErrorController = require("./error/globalErrorController");

app.use(cors());

app.use(cors());

app.options("*", cors());
app.use(logger("common"));

app.use(
	logger("combined", {
		stream: rfs.createStream(
			`${module.exports.name}-${new Date()
				.toISOString()
				.replace(/T.*/, "")
				.split("-")
				.reverse()
				.join("-")}.log`,
			{
				interval: "1d",
				path: join(__dirname, "log"),
			},
		),
	}),
);

const { env } = config.server;
if (env === "development") {
	app.use(logger("dev"));
}

// Add headers before the routes are defined

app.use(express.json({ limit: "50mb" }));
// app.use(require("body-parser").json());
// app.use(require("body-parser").urlencoded({ extended: true }));

// app.use("/", healthCheck);
app.use("/api", UserRouter);

app.all("*", (req, res, next) => {
	next(new AppError(`Can't Found ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorController);

module.exports = app;
