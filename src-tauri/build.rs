fn main() {
    tauri_named_invoke::build("../src/types/__generated__").unwrap();
    tauri_build::build();
}
