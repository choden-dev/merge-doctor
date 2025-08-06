export interface RemoteRepository {
	/**
	 * Used for routing purposes
	 */
	id: string;
	/**
	 * @example
	 *
	 * host_alias
	 * host@1.1.1.1
	 */
	host: string;
	/**
	 * @example
	 *
	 * ssh host "cd <working_directory>
	 */
	workingDirectory: string;
	/**
	 * @example
	 *
	 * /ubuntu/path-to-the-repo-root
	 */
	fullPathOnRemote: string;
	mainBranch?: string;
}
