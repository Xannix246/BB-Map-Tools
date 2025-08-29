// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::sync::Mutex;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

struct AppState {
    map: Mutex<serde_json::Value>,
}

#[tauri::command]
fn get_map(state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let map = state.map.lock().unwrap();
    Ok(map.clone())
}

#[tauri::command]
fn set_map(new_map: serde_json::Value, state: tauri::State<'_, AppState>) {
    let mut map = state.map.lock().unwrap();
    *map = new_map;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            map: Mutex::new(serde_json::json!(null)),
        })
        .invoke_handler(tauri::generate_handler![get_map, set_map])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
