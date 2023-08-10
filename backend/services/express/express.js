const { log } = require("../logger/logger");
const express = require("express");
const cors = require("cors");
const { checkAuth } = require("./security");
const { prepareData } = require("./validate");
const { responseHandler, pathHandler } = require("./responses");

const METHODS = require("../../API/methods");

const server = express();
const PORT = process.env.SERVER_PORT;

server.use(cors());
server.use(express.json());
server.use(require("body-parser").urlencoded({ extended: false }));

const api = express.Router();
api.use(checkAuth);
server.use("/api", api);

for (const { name, type, exec } of METHODS) {
	api[type]("/" + name, prepareData, exec);
}

server.use(responseHandler);
server.use(pathHandler);

function start() {
	return new Promise((resolve, reject) => {
		server.listen(PORT, (err) => {
			if (err) {
				return reject(err);
			}
			log.info("Server starts on port", PORT);
			return resolve();
		});
	});
}

module.exports = { start };
