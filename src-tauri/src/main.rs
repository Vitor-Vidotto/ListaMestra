
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::{Arc, Mutex};
use tauri::{Manager, Window};
mod scripts; // Importa o módulo scripts
use scripts::{rename_files, rename_final::rename_final_dir, renomear_fases::renomear_fases, list_files::list_files_in_directory, set_window_size::set_window_size, set_fullscreen::set_fullscreen, file_manager::{list_files,open_in_explorer,search_files}}; // Importa list_files_in_directory corretamente

// Estrutura para informações dos arquivos
#[derive(serde::Serialize)]
struct FileInfo {
    name: String,
    size: u64,
}

// Criamos uma variável estática para controlar se o close_splashscreen foi executado
lazy_static::lazy_static! {
    static ref SPLASHSCREEN_CLOSED: Arc<Mutex<bool>> = Arc::new(Mutex::new(false));
}

#[tauri::command]
async fn close_splashscreen(window: Window) {
    // Verifica se o comando já foi executado
    let mut closed = SPLASHSCREEN_CLOSED.lock().unwrap();
    if *closed {
        return; // Se já foi fechado, não faz nada
    }
    // Caso contrário, fecha a splashscreen
    let splashscreen = window
        .get_webview_window("splashscreen")
        .expect("Não foi possível encontrar a janela de splashscreen");

    splashscreen.close().unwrap(); // Fecha a splashscreen

    // Exibe a janela principal (listamestra)
    let listamestra = window
        .get_webview_window("listamestra")
        .expect("Não foi possível encontrar a janela principal");

    listamestra.show().unwrap(); // Torna a janela principal visível

    // Marca a splashscreen como fechada
    *closed = true;
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            rename_files::rename_files_in_directory,
            rename_final_dir,
            close_splashscreen,
            renomear_fases,
            list_files_in_directory,  
            set_window_size,
            open_in_explorer,
            list_files,
            search_files,
            set_fullscreen,  // Usa a função importada do módulo
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao rodar o app");
}
