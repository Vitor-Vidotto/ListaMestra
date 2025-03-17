use std::fs;
use std::path::Path;
use regex::Regex;

#[tauri::command]
pub fn rename_final_dir(
    directory: String,
    extensions: Vec<String>,
) -> Result<String, String> {
    let dir_path = Path::new(&directory);

    if !dir_path.is_dir() {
        return Err("Diretório não encontrado.".to_string());
    }

    let re = Regex::new(r"^(.*?)[\-_]\d+(?:\.\w+)?$")
        .map_err(|_| "Falha ao compilar expressão regular.")?;

    let mut renamed_files = Vec::new();
    for entry in fs::read_dir(dir_path).map_err(|_| "Falha ao ler o diretório.")? {
        let entry = entry.map_err(|_| "Falha ao acessar o arquivo.")?;
        let filename = entry
            .file_name()
            .into_string()
            .map_err(|_| "Nome do arquivo inválido.")?;

        if let Some(extension) = filename.rsplit('.').next() {
            if extensions.contains(&extension.to_lowercase()) {
                if let Some(captures) = re.captures(&filename) {
                    let new_name = captures[1].to_string();

                    let (base_name, ext) = match filename.rsplit_once('.') {
                        Some((b, e)) => (b.to_string(), format!(".{}", e)),
                        None => (filename.clone(), "".to_string()),
                    };

                    let new_filename = format!("{}{}", new_name, ext);
                    let old_path = dir_path.join(&filename);
                    let new_path = dir_path.join(&new_filename);

                    if new_path.exists() {
                        return Err(format!("O arquivo {} já existe, evitando sobrescrita.", new_filename));
                    }

                    fs::rename(old_path, new_path).map_err(|_| "Falha ao renomear o arquivo.")?;
                    renamed_files.push(format!(
                        "Renomeado: {} -> {}",
                        filename, new_filename
                    ));
                }
            }
        }
    }

    if renamed_files.is_empty() {
        Ok("Nenhum arquivo com as extensões escolhidas encontrado.".to_string())
    } else {
        Ok(renamed_files.join("\n"))
    }
}
