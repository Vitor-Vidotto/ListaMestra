use std::fs::{self, Metadata};
use std::path::Path;
use serde::Serialize;
use chrono::{DateTime, Local};
use std::time::SystemTime;

#[derive(Serialize)]
pub struct FileDetails {
    name: String,
    extension: Option<String>,
    size: u64,
    created_at: Option<String>,
    modified_at: Option<String>,
}

/// Converte SystemTime para String legível
fn system_time_to_string(time: SystemTime) -> Option<String> {
    let datetime: DateTime<Local> = time.into();
    Some(datetime.format("%Y-%m-%d %H:%M:%S").to_string())
}

#[tauri::command]
pub fn list_files_in_directory(
    directory: String,
    extensions: Option<Vec<String>>,
) -> Result<Vec<FileDetails>, String> {
    let dir_path = Path::new(&directory);

    if !dir_path.is_dir() {
        return Err("Diretório não encontrado.".to_string());
    }

    let mut file_list = Vec::new();

    for entry in fs::read_dir(dir_path).map_err(|_| "Falha ao ler o diretório.")? {
        let entry = entry.map_err(|_| "Falha ao acessar o arquivo.")?;
        let metadata: Metadata = entry.metadata().map_err(|_| "Falha ao obter metadados do arquivo.")?;
        let filename = entry
            .file_name()
            .into_string()
            .map_err(|_| "Nome do arquivo inválido.")?;
        let size = metadata.len();

        let created_at = metadata.created().ok().and_then(system_time_to_string);
        let modified_at = metadata.modified().ok().and_then(system_time_to_string);

        if let Some(extension) = entry.path().extension().and_then(|ext| ext.to_str()) {
            if extensions.as_ref().map_or(true, |exts| exts.contains(&extension.to_lowercase())) {
                file_list.push(FileDetails {
                    name: filename,
                    extension: Some(extension.to_string()),
                    size,
                    created_at,
                    modified_at,
                });
            }
        } else if extensions.is_none() {
            file_list.push(FileDetails {
                name: filename,
                extension: None,
                size,
                created_at,
                modified_at,
            });
        }
    }

    Ok(file_list)
}
