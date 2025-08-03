export const shortenDirectoryPath = (path: string) => {
	const parts = path.split("/");
	if (parts.length < 3) {
		return path;
	}
	return `${parts[0]}/.../${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
};

export const generateIdentifierForFile = (
	oldRevision: string,
	newRevision: string,
) => {
	return `${oldRevision}-${newRevision}`;
};
