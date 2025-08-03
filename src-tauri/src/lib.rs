// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod commands;
pub mod config;
pub mod error;
pub mod executors;
pub mod manager;
use commands::git::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            git_repo_full_path,
            git_current_branch_name,
            git_preview_merge_with_master
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
