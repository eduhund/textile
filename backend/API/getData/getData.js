const { getTexts } = require("../../services/mongo/actions");

/***
 * Get data from our server.
 *
 * @since 0.1.3
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Request data on success; undefined on fail
 */
async function getData(req, res, next) {
	try {
		const { data } = req;
		const content = await getTexts(data);
		next({ code: 0, content });
		return content;
	} catch (e) {
		const err = { e };
		next(err);
		return;
	}
}

module.exports = getData;
