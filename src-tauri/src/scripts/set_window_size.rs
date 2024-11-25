use tauri::window::Window;
use dpi::PhysicalSize;

#[tauri::command]
pub fn set_window_size(window: Window, width: u32, height: u32) {
    let size = PhysicalSize::new(width, height); // Usando o PhysicalSize do winit
    window.set_size(size).unwrap(); // Redimensionando a janela
}
