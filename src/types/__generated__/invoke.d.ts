declare module "@tauri-apps/api/tauri" {
	type Commands =
		| "git_repo_full_path"
		| "git_current_branch_name"
		| "git_preview_merge_with_master";
	function invoke<T>(cmd: Commands, args?: InvokeArgs): Promise<T>;
}
