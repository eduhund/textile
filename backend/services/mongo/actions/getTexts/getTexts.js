const DB = require("../../requests");

async function getTexts({ fileId, pageId }) {
	return DB.getOne("texts", {
		query: {
			fileId,
		},
	});
}

module.exports = getTexts;
