use async_trait::async_trait;
use openssh::{Session, SessionBuilder};
use crate::{
    error::GitCommandError,
    config::types::CommandResult,
    executors::GitCommandExecutor,
};
pub struct SshGitExecutor {
    session: Session,
    working_directory: String,
}
impl SshGitExecutor {
    pub async fn new(host: &str, working_directory: &str) -> Result<Self, GitCommandError> {
        let session = SessionBuilder::default()
            .connect(host)
            .await
            .map_err(GitCommandError::SshError)?;
        Ok(Self { session, working_directory: working_directory.into() })
    }
}
#[async_trait]
impl GitCommandExecutor for SshGitExecutor {
    async fn execute_command(&self, arguments: &[&str]) -> Result<CommandResult, GitCommandError> {
        let full_command = format!("cd {} && git -P {}", self.working_directory, arguments.join(" "));
        println!("{}", full_command);
        let output = self.session
            .raw_command(&full_command)
            .output()
            .await
            .map_err(GitCommandError::SshError)?;
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