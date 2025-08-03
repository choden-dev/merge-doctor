use crate::{
    config::types::{CommandResult, ConnectionType, SshConfig},
    manager::git_manager::GitManager,
};
use tauri::command;

#[command]
pub async fn git_repo_full_path(
    connection_type: ConnectionType,
    ssh_config: Option<SshConfig>,
) -> Result<CommandResult, String> {
    let git_manager = GitManager::new(connection_type, ssh_config)
        .await
        .map_err(|e| e.to_string())?;

    git_manager
        .get_git_full_path()
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn git_current_branch_name(
    connection_type: ConnectionType,
    ssh_config: Option<SshConfig>,
) -> Result<CommandResult, String> {
    let git_manager = GitManager::new(connection_type, ssh_config)
        .await
        .map_err(|e| e.to_string())?;

    git_manager
        .get_git_current_branch()
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn git_preview_merge_with_master(
    connection_type: ConnectionType,
    ssh_config: Option<SshConfig>,
) -> Result<CommandResult, String> {
    let git_manager = GitManager::new(connection_type, ssh_config)
    .await
    .map_err(|e| e.to_string())?;
    git_manager
        .get_merge_preview_with_master()
        .await
        .map_err(|e| e.to_string())
}
