figma.showUI(__html__, { width: 300, height: 350 });

const fileId = figma.fileKey;

figma.ui.postMessage({ action: "SEND_ID", fileId });

figma.ui.onmessage = async (msg: any) => {
	const { action } = msg;
	console.log(msg);

	const page = getCurrentPage();
	if (action === "PUSH_TEXTS") {
		const response = {
			fileId,
			fileName: figma.root.name,
			pageId: page.id,
			pageName: page.name,
			frames: getFramesWithText(page),
		};

		const { OK, data, error } = await fetch(
			"https://apps.eduhund.com/f2s/api/pushData",
			{
				method: "POST",
				headers: {
					Authorization: "sobaka",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(response),
			}
		).then((response) => response.json());

		if (OK) {
			figma.notify("Texts export sucessfully.");
		}

		figma.ui.postMessage({ action: "FETCH_RESPONSE", initAction: action });
	}

	if (action === "PULL_TEXTS") {
		const { OK, data, error } = await fetch(
			`https://apps.eduhund.com/f2s/api/pullData?fileId=${fileId}`,
			{
				method: "GET",
				headers: {
					Authorization: "sobaka",
					"Content-Type": "application/json",
				},
			}
		).then((response) => response.json());

		if (OK) {
			for (const frame of data.frames || []) {
				const frameNode: any = figma.getNodeById(frame?.id);
				frameNode.locked = false;
				for (const text of frame.texts || []) {
					const node: any = figma.getNodeById(text?.id);
					await Promise.all(
						node
							.getRangeAllFontNames(0, node.characters.length)
							.map(figma.loadFontAsync)
					);
					node.characters = text.text;
				}
			}
			figma.notify("New texts imported!");
		}
		figma.ui.postMessage({ action: "FETCH_RESPONSE", initAction: action });
	}

	if (action === "COPY_ID") {
		figma.notify("File ID has been copied to the clipboard");
	}
};

function getCurrentPage() {
	return figma.currentPage;
}

function isNumber(text: string) {
	try {
		const num = Number(text);
		if (typeof num === "number") return true;
		return false;
	} catch {
		throw false;
	}
}

function provideTexts(textNodes: TextNode[]) {
	const textArray: any[] = [];
	for (const item of textNodes) {
		const { id, locked, visible, characters } = item;
		if (characters.length < 2 || locked || !isNumber(characters)) continue;
		const text: any = {
			id,
			isHide: visible,
			text: characters,
		};
		textArray.push(text);
	}
	return textArray;
}

function getFramesWithText(page: PageNode) {
	const pageFrames: any = page.findChildren((n) => n.type === "FRAME");

	return pageFrames.map((frame: FrameNode) => {
		const { id, name } = frame;
		const textNodes = frame.findAllWithCriteria({ types: ["TEXT"] });

		if (textNodes.length === 0) return;

		frame.locked = true;
		return {
			id,
			name,
			texts: provideTexts(textNodes),
		};
	});
}
