use std::fs;
use std::path::Path;
use std::sync::{Arc, Mutex};
use tauri::{Manager, Window};
mod scripts; // Importa o módulo scripts
use scripts::{rename_files, renomear_fases::renomear_fases};

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

// Função para listar os arquivos no diretório
#[tauri::command]
fn list_files_in_directory(directory: String, extensions: Option<Vec<String>>) -> Result<Vec<FileInfo>, String> {
    let dir_path = Path::new(&directory);

    if !dir_path.exists() || !dir_path.is_dir() {
        return Err("O diretório especificado não é válido.".to_string());
    }

    // Lista os arquivos do diretório com base nas extensões
    let mut files = vec![];
    for entry in fs::read_dir(dir_path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
            if extensions.as_ref().map_or(true, |exts| exts.contains(&ext.to_string())) {
                files.push(FileInfo {
                    name: path.file_name().unwrap_or_default().to_string_lossy().to_string(),
                    size: entry.metadata().map_err(|e| e.to_string())?.len(),
                });
            }
        }
    }

    Ok(files)
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
            close_splashscreen,
            renomear_fases,
            list_files_in_directory, // Adicionado o novo comando aqui
        ]) // Registra os comandos
        .run(tauri::generate_context!()) // Executa o aplicativo Tauri
        .expect("Erro ao rodar o app");
}
