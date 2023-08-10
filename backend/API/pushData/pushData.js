const { setTexts } = require("../../services/mongo/actions");

/***
 * Receive data from Figma.
 *
 * @since 0.1.1
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Request data on success; undefined on fail
 */
async function pushData(req, res, next) {
	try {
		const { data } = req;
		await setTexts(data);
		next({});
		return data;
	} catch (e) {
		const err = { e };
		next(err);
		return;
	}
}

module.exports = pushData;
