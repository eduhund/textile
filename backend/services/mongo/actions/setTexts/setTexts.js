const DB = require("../../requests");

async function setTexts(data) {
	const { fileId } = data;
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
