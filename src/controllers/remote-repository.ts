import { invoke } from "@tauri-apps/api/core";
import { useLocalStorage } from "@uidotdev/usehooks";
import { LS_STORED_REMOTE_REPOSITORIES } from "@/constants/local-storage-keys.ts";
import type { RemoteRepository } from "@/types/repository.ts";
import type { CommandResult } from "@/types/tauri.ts";

export class RemoteRepositoryController {
	private readonly connectionType = "Ssh";
	private readonly commandOptions;
	constructor(
		private readonly hostName: string,
		private readonly workingDirectory: string,
	) {
		this.commandOptions = {
			connectionType: this.connectionType,
			sshConfig: {
				host: this.hostName,
				working_directory: this.workingDirectory,
			},
		};
	}

	async checkRepositoryHealth(): Promise<CommandResult> {
		return await invoke("git_repo_full_path", this.commandOptions);
	}

	async getCurrentGitBranch(): Promise<CommandResult> {
		return await invoke("git_current_branch_name", this.commandOptions);
	}

	async getDiffForPreviewMergeWithMaster(): Promise<CommandResult> {
		return await invoke("git_preview_merge_with_master", this.commandOptions);
	}
}

export const useRemoteRepositories = () =>
	useLocalStorage<RemoteRepository[]>(LS_STORED_REMOTE_REPOSITORIES, []);
