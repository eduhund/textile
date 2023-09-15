const { setTexts } = require("../../services/mongo/actions");

/***
 * Receive data from Google Sheets.
 *
 * @since 0.1.4
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Request data on success; undefined on fail
 */
async function setData(req, res, next) {
	try {
		const { data } = req;
		const { fileId, fileName, pages, variables } = data;

		const pagesList = {}

		for (const page of pages) {
			pagesList[page.pageId] = page
		}
		const setData = {
			fileId,
			fileName,
			pages: pagesList,
			variables,
		};
		await setTexts(data.fileId, setData);
		next({});
		return data;
	} catch (e) {
		const err = { e };
		next(err);
		return;
	}
}

module.exports = setData;
