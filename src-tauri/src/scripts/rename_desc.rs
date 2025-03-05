use std::fs;
use std::path::Path;
use regex::Regex;

#[tauri::command]
pub fn rename_desc(
    directory: String,
    extensions: Vec<String>,
) -> Result<String, String> {
    let dir_path = Path::new(&directory);

    // Verifica se o diretório existe
    if !dir_path.is_dir() {
        return Err("Diretório não encontrado.".to_string());
    }

    // Compila a expressão regular para capturar o número final após '-' ou '_'
    let re = Regex::new(r"([\w\-]+[\-_R]\d{2})").map_err(|_| "Falha ao compilar expressão regular.")?;

    // Percorre os arquivos no diretório
    let mut renamed_files = Vec::new();
    for entry in fs::read_dir(dir_path).map_err(|_| "Falha ao ler o diretório.")? {
        let entry = entry.map_err(|_| "Falha ao acessar o arquivo.")?;
        let filename = entry
            .file_name()
            .into_string()
            .map_err(|_| "Nome do arquivo inválido.")?;

        // Verifica se o arquivo tem uma das extensões escolhidas
        if let Some(extension) = filename.rsplit('.').next() {
            if extensions.contains(&extension.to_lowercase()) {
                if let Some(captures) = re.captures(&filename) {
                    // Remove tudo após o -RXX
                    let new_name = captures[1].to_string();
                    let (base_name, ext) = filename.rsplit_once('.').unwrap();
                    let new_filename = format!("{}.{}", new_name, ext);

                    let old_path = dir_path.join(&filename);
                    let new_path = dir_path.join(&new_filename);

                    // Renomeia o arquivo
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
