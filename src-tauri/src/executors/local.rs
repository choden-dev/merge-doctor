use async_trait::async_trait;
use std::process::Command;
use crate::{
    error::GitCommandError,
    config::types::CommandResult,
    executors::GitCommandExecutor,
};
use crate::error::CustomCommandError;
use crate::executors::CustomCommandExecutor;

pub struct LocalGitExecutor;
#[async_trait]
impl GitCommandExecutor for LocalGitExecutor {
    async fn execute_command(&self, command: &[&str]) -> Result<CommandResult, GitCommandError> {
        let output = Command::new("git")
            .args(command)
            .output()?;
        let success = output.status.success();
        let stdout = String::from_utf8_lossy(&output.stdout).to_string();
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        Ok(CommandResult {
            success,
            output: stdout,
            error: if !stderr.is_empty() { Some(stderr) } else { None },
        })
    }
}
pub struct LocalCustomCommandExecutor;
#[async_trait]
impl CustomCommandExecutor for LocalCustomCommandExecutor {
    async fn execute_command(&self, command: &str) -> Result<CommandResult, CustomCommandError> {
        let output = Command::new(command)
            .output()?;
        let success = output.status.success();
        let stdout = String::from_utf8_lossy(&output.stdout).to_string();
        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        Ok(CommandResult {
            success,
            output: stdout,
            error: if !stderr.is_empty() { Some(stderr) } else { None },
        })
    }
}
