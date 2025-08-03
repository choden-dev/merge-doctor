use async_trait::async_trait;
use crate::{error::GitCommandError, config::types::CommandResult};
#[async_trait]
pub trait GitCommandExecutor: Send + Sync {
    async fn execute_command(&self, arguments: &[&str]) -> Result<CommandResult, GitCommandError>;
}
pub mod local;
pub mod ssh;
