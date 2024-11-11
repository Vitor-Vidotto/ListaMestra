mod scripts;  // Importa o módulo scripts

use tauri::command;
use tauri::{Manager, Window};  // Importa as dependências necessárias

// Importa o módulo rename_files do scripts
use scripts::rename_files; 

// Função para fechar a splashscreen e abrir o app principal
#[tauri::command]
async fn close_splashscreen(window: Window) {
    // Fechar a janela splashscreen
    let splashscreen = window.get_webview_window("splashscreen")
        .expect("Não foi possível encontrar a janela de splashscreen");
    
    splashscreen.close().unwrap(); // Fecha a splashscreen

    // Exibir a janela principal (listamestra)
    let listamestra = window.get_webview_window("listamestra")
        .expect("Não foi possível encontrar a janela principal");

    listamestra.show().unwrap(); // Torna a janela principal visível
}

fn main() {
    tauri::Builder::default()
        // Registra o comando para renomeação
        .invoke_handler(tauri::generate_handler![rename_files::rename_files_in_directory, close_splashscreen]) 
        .run(tauri::generate_context!()) // Executa o aplicativo Tauri
        .expect("Erro ao rodar o app");
}
