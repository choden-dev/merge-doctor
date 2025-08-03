use crate::{
    config::types::{CommandResult, ConnectionType, SshConfig},
    error::GitCommandError,
    executors::{local::LocalGitExecutor, ssh::SshGitExecutor, GitCommandExecutor},
};
pub struct GitManager {
    executor: Box<dyn GitCommandExecutor>,
}
impl GitManager {
    pub async fn new(
        connection_type: ConnectionType,
        ssh_config: Option<SshConfig>,
    ) -> Result<Self, GitCommandError> {
        let executor = match connection_type {
            ConnectionType::Local => Box::new(LocalGitExecutor) as Box<dyn GitCommandExecutor>,
            ConnectionType::Ssh => {
                let config = ssh_config.ok_or_else(|| {
                    GitCommandError::CommandFailed(
                        "SSH config required for SSH connection".to_string(),
                    )
                })?;
                Box::new(SshGitExecutor::new(&config.host, &config.working_directory).await?)
            }
        };
        Ok(Self { executor })
    }
    pub async fn get_git_full_path(&self) -> Result<CommandResult, GitCommandError> {
        self.executor
            .execute_command(&["rev-parse", "--show-toplevel"])
            .await
    }

    pub async fn get_git_current_branch(&self) -> Result<CommandResult, GitCommandError> {
        self.executor
            .execute_command(&["branch", "--show-current"])
            .await
    }

    pub async fn get_merge_preview_with_master(&self) -> Result<CommandResult, GitCommandError> {
        let current_branch_result = self.get_git_current_branch().await;
        let current_branch = current_branch_result?.output.clone();

        let merge_base_arg = format!(
            "$(git merge-base master {} master)",
            current_branch
        );
        self.executor
            .execute_command(&[
                "diff",
                    merge_base_arg
                .as_str(),
            ])
            .await
    }
}
