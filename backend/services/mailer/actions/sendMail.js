const { mailer } = require("../mailer");

const { MAIL_FROM } = process.env;

function sendMail({ to, subject, mail = "", att }) {
	mailer.sendMail({
		from: MAIL_FROM,
		to,
		subject,
		html: mail,
		attachments: [
			{
				filename: "texts.json",
				content: new Buffer.from(att, "utf-8"),
			},
		],
	});
}

module.exports = sendMail;
