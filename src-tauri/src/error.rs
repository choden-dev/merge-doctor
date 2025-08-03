use thiserror::Error;
#[derive(Error, Debug)]
pub enum GitCommandError {
    #[error("Git command failed: {0}")]
    CommandFailed(String),
    #[error("SSH connection failed: {0}")]
    SshError(#[from] openssh::Error),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}
#[derive(Error, Debug)]
pub enum CustomCommandError {
    #[error("Custom command failed: {0}")]
    CommandFailed(String),
    #[error("SSH connection failed: {0}")]
    SshError(#[from] openssh::Error),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}
