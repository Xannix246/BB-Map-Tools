// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::{
    io::copy,
    path::Path,
    sync::{Arc, Mutex},
};
use steamworks::{AccountId, AppIDs, AppId, Client, PublishedFileId, UserList, UserListOrder};

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

// steam things

fn steamid64_to_accountid(steamid64: u64) -> u32 {
    (steamid64 & 0xFFFFFFFF) as u32
}

#[tauri::command]
// -> Result<Option<(u64, String)>, String>
fn find_map(author_id: u64, name: String) {
    let client = Client::init().expect("Steam is not running or has not been detected");
    let ugc = client.ugc();

    // ugc.query_user(account, list_type, item_type, sort_order, appids, page)
    let query = ugc
        .query_user(
            AccountId::from_raw(steamid64_to_accountid(author_id)),
            UserList::Published,
            steamworks::UGCType::All,
            UserListOrder::CreationOrderDesc,
            AppIDs::Both {
                creator: AppId(2330500),
                consumer: AppId(2330500),
            },
            2,
        )
        .unwrap();

    query.fetch(move |create_result| {
        println!("callback triggered!");
        match create_result {
            Ok(res) => {
                println!("returned result, {}", res.total_results());
                for i in 0..res.total_results() {
                    let details = res.get(i).unwrap();
                    println!("Found: {} ({})", details.title, details.published_file_id.0);
                }
            }
            Err(e) => println!("Error: {:?}", e),
        }
    });

    for _ in 0..300 {
        client.run_callbacks();
        std::thread::sleep(std::time::Duration::from_millis(16));
    }
}

#[tauri::command]
fn upload_map(title: String, description: String, preview_path: String, content_path: String) {
    let client = Client::init().expect("Steam is not running or has not been detected");
    let ugc = client.ugc();

    let mut created_id: u64 = 0;

    ugc.create_item(
        steamworks::AppId(2330500),
        steamworks::FileType::Community,
        move |create_result: Result<(PublishedFileId, bool), steamworks::SteamError>| {
            match create_result {
                Ok((pub_id, _tos)) => {
                    println!("Created: {}", pub_id.0);
                    created_id = pub_id.0;
                }
                Err(e) => {}
            }
        },
    );

    println!("{}", created_id);

    for _ in 0..600 {
        client.run_callbacks();
        std::thread::sleep(std::time::Duration::from_millis(16));

        ugc.start_item_update(steamworks::AppId(2330500), PublishedFileId(created_id))
            .content_path(Path::new(&content_path))
            .preview_path(Path::new(&preview_path))
            .title(&title)
            .description(&description)
            .submit(
                Some("Initial release"),
                |upload_result: Result<(PublishedFileId, bool), steamworks::SteamError>| {
                    match upload_result {
                        Ok((pub_id, _)) => println!("Upload success: {}", pub_id.0),
                        Err(e) => eprintln!("Upload failed: {:?}", e),
                    }
                },
            );
    }

    for _ in 0..600 {
        client.run_callbacks();
        std::thread::sleep(std::time::Duration::from_millis(16));
        println!("{}", created_id);
    }
}

#[tauri::command]
fn update_map(
    published_id: u64,
    content_path: String,
    preview_path: String,
    title: String,
    description: String,
) {
    let client = Client::init().expect("Steam is not running or has not been detected");
    let ugc = client.ugc();

    ugc.start_item_update(steamworks::AppId(2330500), PublishedFileId(published_id))
        .content_path(Path::new(&content_path))
        .preview_path(Path::new(&preview_path))
        .title(&title)
        .description(&description)
        .submit(
            Some("Update notes"),
            |upload_result: Result<(PublishedFileId, bool), steamworks::SteamError>| {
                match upload_result {
                    Ok((pub_id, tos)) => {}
                    Err(e) => {}
                }
            },
        );
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            map: Mutex::new(serde_json::json!(null)),
        })
        .invoke_handler(tauri::generate_handler![get_map, set_map])
        // .invoke_handler(tauri::generate_handler![
        //     find_map,
        //     upload_map,
        //     update_map
        // ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
