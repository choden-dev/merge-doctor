/**
 * Removes special characters from string
 */
export const normalisePaths = (original: string) => {
	return original.replace(/[^a-zA-Z0-9]/g, "").trim();
};
