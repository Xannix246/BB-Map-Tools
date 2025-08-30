// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::{path::Path, sync::Mutex};
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
#[tauri::command]
fn find_map(author_id: u32, name: String) -> Result<Option<(u64, String)>, String> {
    let client = Client::init().expect("Steam is not running or has not been detected");
    let ugc = client.ugc();

    // ugc.query_user(account, list_type, item_type, sort_order, appids, page)
    let query: Result<steamworks::QueryHandle, steamworks::CreateQueryError> = ugc.query_user(
            AccountId::from_raw(author_id),
            UserList::Published,
            steamworks::UGCType::Items,
            UserListOrder::CreationOrderDesc,
            AppIDs::ConsumerAppId(AppId(2330500)),
            1
        );

    match query {
        Ok(handle) => {
            handle.fetch(|create_result: Result<steamworks::QueryResults<'_>, steamworks::SteamError>| {
                match create_result {
                    Ok(res) => {
                        
                    }
                    Err(e) => {

                    }
                }
            });
            Ok(None)
        }
        Err(e) => {
            Err(format!("Query creation failed: {:?}", e))
        }
    }
}

#[tauri::command]
fn upload_map(
    content_path: String,
    preview_path: String,
    title: String,
    description: String
) {
    let client = Client::init().expect("Steam is not running or has not been detected");
    let ugc = client.ugc();
    let mut published_id: PublishedFileId = PublishedFileId(0);

    ugc.create_item(
        steamworks::AppId(2330500),
        steamworks::FileType::Community,
        |create_result: Result<(PublishedFileId, bool), steamworks::SteamError>| {
            match create_result {
                Ok((pub_id, tos)) => {
                    //published_id = pub_id;
                }
                Err(e) => {

                }
            }
        }
    );

    ugc.start_item_update(steamworks::AppId(2330500), published_id)
        .content_path(Path::new(&content_path))
        .preview_path(Path::new(&preview_path))
        .title(&title)
        .description(&description)
        .submit(
            Some("Initial release"), 
            |upload_result: Result<(PublishedFileId, bool), steamworks::SteamError>| {
                match upload_result {
                    Ok((pub_id, tos)) => {

                    }
                    Err(e) => {

                    }
                }
            }
        );
}

#[tauri::command]
fn update_map(
    published_id: u64, 
    content_path: String, 
    preview_path: String, 
    title: String, 
    description: String
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
                    Ok((pub_id, tos)) => {

                    }
                    Err(e) => {

                    }
                }
            }
        );
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
        .invoke_handler(tauri::generate_handler![
            find_map,
            upload_map,
            update_map
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
