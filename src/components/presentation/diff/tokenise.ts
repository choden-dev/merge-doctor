import {
	type HunkData,
	markEdits,
	type TokenizeOptions,
	tokenize,
} from "react-diff-view";

export const tokenise = (hunks: HunkData[]) => {
	if (!hunks) {
		return undefined;
	}

	const options: TokenizeOptions = {
		highlight: false,
		enhancers: [markEdits(hunks, { type: "block" })],
	};

	try {
		return tokenize(hunks, options);
	} catch (_e) {
		return undefined;
	}
};
