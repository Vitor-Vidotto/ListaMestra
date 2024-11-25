use tauri::window::Window;

#[tauri::command]
pub fn set_fullscreen(window: Window) {
    // Verifica se a janela está maximizada
    if window.is_maximized().unwrap() {
        // Se estiver maximizada, restaura o tamanho normal
        window.unmaximize().unwrap();
        window.set_resizable(true).unwrap(); // Torna a janela redimensionável novamente
    } else {
        // Se não estiver maximizada, maximiza a janela
        window.maximize().unwrap();
        window.set_resizable(false).unwrap(); // Desativa o redimensionamento (opcional)
    }
}