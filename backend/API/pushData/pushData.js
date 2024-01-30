const { getTexts, setTexts } = require("../../services/mongo/actions");

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
		const { fileId, pluginId, fileName, pageId, pageName, frames, variables } = data;
		const currentFile = await getTexts(data.fileId);
		const pages = Object.keys(currentFile?.pages || {})

		if (pages.length > 0 && pages[0] !== pageId && pluginId !== "xxx") {
			const err = { code: 20101 };
			next(err);
			return
		}

		const setData = {
			fileId,
			fileName,
			[`pages.${pageId}`]: {
				pageId,
				pageName,
				frames,
			},
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

module.exports = pushData;
