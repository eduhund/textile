/***
 * Basic echo method.
 *
 * @since 0.1.0
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Request data on success; undefined on fail
 */
async function echo(req, res, next) {
	try {
		const { data } = req;
		next({ content: data });
		return content;
	} catch (e) {
		const err = { e };
		next(err);
		return;
	}
}

module.exports = echo;
