use std::fs;
use std::path::Path;
use tauri::command;

#[command]
pub fn renomear_fases(diretorio: String, sigla_antiga: String, sigla_nova: String) -> Result<String, String> {
    let diretorio_path = Path::new(&diretorio);

    // Verificar se o diretório existe
    if !diretorio_path.exists() {
        return Err("Diretório não encontrado!".into());
    }

    // Listar todos os arquivos no diretório
    let arquivos = match fs::read_dir(diretorio_path) {
        Ok(entries) => entries,
        Err(_) => return Err("Erro ao ler o diretório.".into()),
    };

    // Definir um conjunto de separadores válidos
    let separadores = ['-', '_', ' '];

    for entry in arquivos {
        if let Ok(entry) = entry {
            let arquivo_nome = entry.file_name().into_string().unwrap();

            // Verificar se a sigla antiga está no nome do arquivo
            if arquivo_nome.contains(&sigla_antiga) {
                let mut novo_nome = arquivo_nome.clone();
                for separador in &separadores {
                    // Substituir a sigla, considerando os separadores
                    novo_nome = novo_nome.replace(
                        &format!("{}{}{}", separador, sigla_antiga, separador),
                        &format!("{}{}{}", separador, sigla_nova, separador),
                    );
                    novo_nome = novo_nome.replace(
                        &format!("{}{}", sigla_antiga, separador),
                        &format!("{}{}", sigla_nova, separador),
                    );
                    novo_nome = novo_nome.replace(
                        &format!("{}{}", separador, sigla_antiga),
                        &format!("{}{}", separador, sigla_nova),
                    );
                }

                // Remover separador extra no início ou fim, se existir
                novo_nome = novo_nome.trim_matches(&['-', '_', ' '][..]).to_string();

                // Renomear o arquivo se houver mudança
                if novo_nome != arquivo_nome {
                    let antigo_caminho = diretorio_path.join(&arquivo_nome);
                    let novo_caminho = diretorio_path.join(novo_nome);
                    match fs::rename(antigo_caminho, novo_caminho) {
                        Ok(_) => (),
                        Err(_) => return Err("Erro ao renomear o arquivo.".into()),
                    }
                }
            }
        }
    }

    Ok("Arquivos renomeados com sucesso!".into())
}
