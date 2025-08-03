use async_trait::async_trait;
use crate::{error::GitCommandError, config::types::CommandResult};
use crate::error::CustomCommandError;

#[async_trait]
pub trait GitCommandExecutor: Send + Sync {
    async fn execute_command(&self, arguments: &[&str]) -> Result<CommandResult, GitCommandError>;
}

#[async_trait]
pub trait CustomCommandExecutor: Send + Sync {
    async fn execute_command(&self, command: &str) -> Result<CommandResult, CustomCommandError>;
}
pub mod local;
pub mod ssh;
