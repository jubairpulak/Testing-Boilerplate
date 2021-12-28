const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
	//1)create transporter

	const transporter = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "657f91b5052fbc",
			pass: "05343830105a7f",
		},
	});
	//2) Define the email options
	const mailOptions = {
		from: "Jubair PUlak <jubair77@gmail.com>",
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	//3) actually send the email
	await transporter.sendMail(mailOptions);
	return;
};

module.exports = sendEmail;
