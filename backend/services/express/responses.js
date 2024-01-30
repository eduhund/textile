const { log } = require("../logger/logger");

const ERRORS = [
	{
		code: -1,
		type: "other_error",
	},
	{
		code: 10001,
		type: "invalid_request",
		description: "Invalid path",
	},
	{
		code: 10002,
		type: "invalid_request",
		description: "Missing required params",
	},
	{
		code: 10101,
		type: "invalid_credentials",
		description: "Invalid API key",
	},
	{
		code: 20101,
		type: "process_failure",
		description: "You reach the page limit in this file",
	},
	{
		code: 20201,
		type: "process_failure",
		description: "Error in echo process",
	},
];

function responseGenerator(code, data = {}) {
	if (code === 0) {
		return { OK: true, data };
	} else {
		const error = ERRORS.find((error) => error.code === code) || -1;
		return { OK: false, error };
	}
}

function responseHandler(message, req, res, next) {
	const { code, content, trace } = message;
	const { data } = req;
	if (!code) {
		log.debug({ input: data, output: message });
		res.status(200).send(responseGenerator(0, content));
		return;
	}
	const error = responseGenerator(code || -1);
	if (code > 10000 && code < 20000) {
		log.debug(trace);
		log.warn({ input: data, output: error });
		res.status(400).send(error);
		return;
	} else {
		log.debug(trace);
		log.error({ input: data, output: error });
		res.status(500).send(error);
		return;
	}
}

function pathHandler(req, res, next) {
	res.status(404);
	res.send(responseGenerator(10001));
	return;
}

module.exports = { responseHandler, pathHandler };
