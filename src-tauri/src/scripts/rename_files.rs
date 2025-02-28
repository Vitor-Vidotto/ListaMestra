use std::fs;
use std::path::Path;
use regex::Regex;

#[tauri::command]
pub fn rename_files_in_directory(
    directory: String,
    extensions: Vec<String>,
) -> Result<String, String> {
    let dir_path = Path::new(&directory);

    // Verifica se o diretório existe
    if !dir_path.is_dir() {
        return Err("Diretório não encontrado.".to_string());
    }

    // Compila a expressão regular para capturar todos os números no nome do arquivo
    let re = Regex::new(r"\d+").map_err(|_| "Falha ao compilar expressão regular.")?;


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
                let (name, ext) = filename.rsplit_once('.').unwrap();


                // Coleta todos os números do nome do arquivo
                let numbers: Vec<&str> = re.find_iter(name)
                    .map(|m| m.as_str())
                    .collect();

                // Se houver mais de um número, realizamos a substituição
                if numbers.len() > 1 {
                    let first_number_str = numbers[0]; // Primeiro número
                    let last_number_str = numbers[numbers.len() - 1]; // Último número

                    // Renomeia substituindo o primeiro número pelo último
                    let mut new_name = name.replace(first_number_str, last_number_str);

                    // Remove a parte após o último hífen (se houver)
                    if let Some(pos) = new_name.rfind('-') {
                        new_name = new_name[..pos].to_string(); // Mantém o que está antes do último hífen
                    }


                    let new_filename = format!("{}.{}", new_name, ext);
                    let old_path = dir_path.join(&filename);
                    let new_path = dir_path.join(new_filename.clone());

                    // Renomeia o arquivo

                    fs::rename(old_path, new_path).map_err(|_| "Falha ao renomear o arquivo.")?;                        

                    renamed_files.push(format!(
                        "Renomeado: {} -> {}",
                        filename,
                        new_filename.clone()
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
