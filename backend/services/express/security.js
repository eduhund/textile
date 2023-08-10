const { API_KEY } = process.env;

/***
 * Function checks user access token.
 *
 * @returns {boolean} Result of auth checking
 */
function checkAuth(req, res, next) {
	const userKey = req?.headers?.authorization;
	if (userKey !== API_KEY) {
		next({ code: 10101 });
		return false;
	}

	next();
	return true;
}

module.exports = { checkAuth };
