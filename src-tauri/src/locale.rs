//! UI locale shared by native menus. Display text only; command IDs and
//! accelerators remain unchanged. The webview requests a restart after edits.
use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::OnceLock;
use tauri::{AppHandle, Manager};

static ENGLISH: AtomicBool = AtomicBool::new(false);
static MESSAGES: OnceLock<HashMap<String, String>> = OnceLock::new();

pub fn init(app: &AppHandle) {
    let english = app
        .path()
        .app_data_dir()
        .ok()
        .and_then(|dir| std::fs::read_to_string(dir.join("interface-locale.txt")).ok())
        .is_some_and(|value| value.trim() == "en");
    ENGLISH.store(english, Ordering::Relaxed);
}

pub fn t(source: &str) -> &str {
    if ENGLISH.load(Ordering::Relaxed) {
        return source;
    }
    MESSAGES
        .get_or_init(|| {
            serde_json::from_str(include_str!("../../src/shared/i18n/zh-CN.json"))
                .expect("the bundled Chinese UI dictionary must be valid")
        })
        .get(source)
        .map(String::as_str)
        .unwrap_or(source)
}

#[tauri::command]
pub fn interface_set_locale(app: AppHandle, locale: String) -> Result<(), String> {
    if locale != "en" && locale != "zh-CN" {
        return Err("Unsupported interface locale".to_string());
    }
    let dir = app.path().app_data_dir().map_err(|error| error.to_string())?;
    std::fs::create_dir_all(&dir).map_err(|error| error.to_string())?;
    std::fs::write(dir.join("interface-locale.txt"), &locale)
        .map_err(|error| error.to_string())?;
    // Do not alter an active app's menu tree or interrupt a running agent.
    // The saved locale is picked up by init() on the next launch.
    Ok(())
}
