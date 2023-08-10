const { MongoClient } = require("mongodb");

const DB_URL = process.env.DATABASE_URL;
const DB_NAME = process.env.DATABASE_NAME;

const client = new MongoClient(DB_URL);

function getCollection(name) {
	return client.db(DB_NAME).collection(name);
}

async function connect() {
	await client.connect();
	console.log("Connected to database");
}

module.exports = {
	connect,
	getCollection,
};
