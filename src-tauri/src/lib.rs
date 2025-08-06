// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod commands;
pub mod config;
pub mod error;
pub mod executors;
pub mod manager;
use commands::git::*;
use commands::custom::*;

use specta_typescript::Typescript;
use tauri_specta::{collect_commands, Builder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![
            git_repo_full_path,
            git_current_branch_name,
            git_merge_preview_with_target_branch,
            custom_command_freeform
        ]);

    #[cfg(debug_assertions)] // <- Only export on non-release builds
    builder
        .export(Typescript::default(), "../src/types/__generated__/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
