use crate::{
    config::types::{CommandResult, ConnectionType, SshConfig},
};

use crate::error::CustomCommandError;
use crate::executors::CustomCommandExecutor;
use crate::executors::local::LocalCustomCommandExecutor;
use crate::executors::ssh::SshCustomCommandExecutor;

pub struct CustomCommandManager {
    executor: Box<dyn CustomCommandExecutor>,
}
impl CustomCommandManager {
    pub async fn new(
        connection_type: ConnectionType,
        ssh_config: Option<SshConfig>,
    ) -> Result<Self, CustomCommandError> {
        let executor = match connection_type {
            ConnectionType::Local => Box::new(LocalCustomCommandExecutor) as Box<dyn CustomCommandExecutor>,
            ConnectionType::Ssh => {
                let config = ssh_config.ok_or_else(|| {
                    CustomCommandError::CommandFailed(
                        "SSH config required for SSH connection".to_string(),
                    )
                })?;
                Box::new(SshCustomCommandExecutor::new(&config.host, &config.working_directory).await?)
            }
        };
        Ok(Self { executor })
    }
    pub async fn run_custom_command(&self, command: &str) -> Result<CommandResult, CustomCommandError> {
        self.executor
            .execute_command(command)
            .await
    }

}
