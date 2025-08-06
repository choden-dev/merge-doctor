use crate::{
    config::types::{CommandResult, ConnectionType, SshConfig},
    manager::git_manager::GitManager,
};
use tauri::command;

#[command]
#[specta::specta]
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
#[specta::specta]
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
#[specta::specta]
pub async fn git_merge_preview_with_target_branch(
    connection_type: ConnectionType,
    ssh_config: Option<SshConfig>,
    to_compare: &str,
    target_branch: &str,
) -> Result<CommandResult, String> {
    let git_manager = GitManager::new(connection_type, ssh_config)
    .await
    .map_err(|e| e.to_string())?;
    git_manager
        .get_merge_preview_with_target_branch(to_compare, target_branch)
        .await
        .map_err(|e| e.to_string())
}
