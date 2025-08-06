use crate::{
    config::types::{CommandResult, ConnectionType, SshConfig},
    manager::custom_command_manager::CustomCommandManager,
};
use tauri::command;

#[command]
#[specta::specta]
pub async fn custom_command_freeform(
    connection_type: ConnectionType,
    ssh_config: Option<SshConfig>,
    command: &str
) -> Result<CommandResult, String> {
    let custom_command_manager = CustomCommandManager::new(connection_type, ssh_config)
        .await
        .map_err(|e| e.to_string())?;

    custom_command_manager
        .run_custom_command(command)
        .await
        .map_err(|e| e.to_string())
}
