/***
 * Function check all incoming API params: required and optional.
 * It validates them and delet unnecessary params.
 *
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @param {Function} next Express middleware next function
 *
 * @returns {Object | undefined} Prepared data on success; undefined on fail
 */
function prepareData(req, res, next) {
	try {
		const { data = {}, query = {}, body = {} } = req;
		req.data = { ...query, ...body };
		next();
		return data;
	} catch (e) {
		const err = { trace: e };
		next(err);
		return;
	}
}

module.exports = { prepareData };
