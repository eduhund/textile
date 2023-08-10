const log4js = require("log4js");

log4js.configure({
	appenders: {
		out: { type: "stdout" },
		file: { type: "file", filename: "./logs/eduhund-bot.log" },
	},
	categories: {
		default: { appenders: ["out", "file"], level: "debug" },
	},
});

const log = log4js.getLogger("f2s");

module.exports = { log };
