use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub enum ConnectionType {
    Local = 0,
    Ssh = 1,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct SshConfig {
    pub host: String,
    pub working_directory: String,
}
#[derive(Debug, Serialize, Deserialize, Type)]
pub struct CommandResult {
    pub success: bool,
    pub output: String,
    pub error: Option<String>,
}