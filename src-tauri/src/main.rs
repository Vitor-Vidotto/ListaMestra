use tauri::{Manager, Window};  // Importa as dependências necessárias
use std::sync::{Arc, Mutex};   // Para controlar o estado de execução
mod scripts;  // Importa o módulo scripts

use scripts::{rename_files, renomear_fases::renomear_fases};  // Importa a função `renomear_fases` corretamente

// Criamos uma variável estática para controlar se o close_splashscreen foi executado
lazy_static::lazy_static! {
    static ref SPLASHSCREEN_CLOSED: Arc<Mutex<bool>> = Arc::new(Mutex::new(false));
}

#[tauri::command]
async fn close_splashscreen(window: Window) {
    // Verifica se o comando já foi executado
    let mut closed = SPLASHSCREEN_CLOSED.lock().unwrap();
    if *closed {
        return;  // Se já foi fechado, não faz nada
    }

    // Caso contrário, fecha a splashscreen
    let splashscreen = window.get_webview_window("splashscreen")
        .expect("Não foi possível encontrar a janela de splashscreen");

    splashscreen.close().unwrap(); // Fecha a splashscreen

    // Exibe a janela principal (listamestra)
    let listamestra = window.get_webview_window("listamestra")
        .expect("Não foi possível encontrar a janela principal");

    listamestra.show().unwrap(); // Torna a janela principal visível

    // Marca a splashscreen como fechada
    *closed = true;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![rename_files::rename_files_in_directory, close_splashscreen, renomear_fases]) // Registra os comandos
        .run(tauri::generate_context!()) // Executa o aplicativo Tauri
        .expect("Erro ao rodar o app");
}
