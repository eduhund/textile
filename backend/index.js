require("dotenv").config();
const server = require("./services/express/express");
const db = require("./services/mongo/mongo");

server.start();
db.connect();
