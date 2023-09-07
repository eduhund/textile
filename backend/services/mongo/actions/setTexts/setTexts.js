const DB = require("../../requests");

async function setTexts(fileId, data) {
	DB.setOne("texts", {
		query: {
			fileId,
		},
		set: data,
		options: {
			insertNew: true,
		},
	});
}

module.exports = setTexts;
