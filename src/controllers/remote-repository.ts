import { useLocalStorage } from "@uidotdev/usehooks";
import { LS_STORED_REMOTE_REPOSITORIES } from "@/constants/local-storage-keys.ts";
import { commands } from "@/types/__generated__/bindings.ts";
import type { RemoteRepository } from "@/types/repository.ts";

export class RemoteRepositoryController {
	private readonly connectionType = "Ssh";
	private readonly sshConfig;
	constructor(
		private readonly hostName: string,
		private readonly workingDirectory: string,
	) {
		this.sshConfig = {
			host: this.hostName,
			working_directory: this.workingDirectory,
		};
	}

	async checkRepositoryHealth() {
		return await commands.gitRepoFullPath(this.connectionType, this.sshConfig);
	}

	async getCurrentGitBranch() {
		return await commands.gitCurrentBranchName(
			this.connectionType,
			this.sshConfig,
		);
	}

	async getMergePreviewWithTargetBranch(target: string, toCompare: string) {
		return await commands.gitMergePreviewWithTargetBranch(
			this.connectionType,
			this.sshConfig,
			target,
			toCompare,
		);
	}

	async runFreeformCommand(command: string) {
		return await commands.customCommandFreeform(
			this.connectionType,
			this.sshConfig,
			command,
		);
	}
}

export const useRemoteRepositories = () =>
	useLocalStorage<RemoteRepository[]>(LS_STORED_REMOTE_REPOSITORIES, []);
