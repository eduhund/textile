const DB = require("../../requests");

async function getTexts(fileId) {
	return DB.getOne("texts", {
		query: {
			fileId,
		},
	});
}

module.exports = getTexts;
