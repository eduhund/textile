figma.showUI(__html__);

figma.ui.onmessage = async (msg: any) => {
	const { action, data } = msg;

	const { promt } = data;
	let fileId = "";

	if (promt.startsWith("https://")) {
		fileId = promt.split("/")[4];
	} else {
		fileId = promt;
	}

	const page = getCurrentPage();
	if (action === "PUSH_DATA") {
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
	}

	if (action === "PULL_DATA") {
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
			await figma.loadFontAsync({ family: "Inter", style: "Black" });
			await figma.loadFontAsync({
				family: "Font Awesome 5 Free",
				style: "Solid",
			});
			await figma.loadFontAsync({ family: "Inter", style: "Regular" });

			for (const frame of data.frames || []) {
				const frameNode: any = figma.getNodeById(frame?.id);
				frameNode.locked = false;
				for (const text of frame.texts || []) {
					const node: any = figma.getNodeById(text?.id);
					node.characters = text.text;
				}
			}
			figma.notify("New texts imported!");
		}
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
		console.log(item);
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
