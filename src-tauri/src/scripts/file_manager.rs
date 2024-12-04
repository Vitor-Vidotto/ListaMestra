use std::fs::{self, DirEntry};
use std::path::{Path, PathBuf};
use std::process::Command;

#[derive(Debug, Clone, serde::Serialize)]
pub struct FileNode {
    pub nome: String,
    pub tipo: String, // "file" ou "directory"
    pub caminho: String, // Caminho completo do arquivo/pasta
    pub conteudo: Option<Vec<FileNode>>, // Conteúdo das subpastas (se for um diretório)
}

// Função recursiva para listar arquivos e pastas em um diretório com profundidade limitada
fn list_files_recursive(diretorio: &Path, profundidade: usize, max_depth: usize) -> Vec<FileNode> {
    let mut nodes = Vec::new();

    // Limita a profundidade da busca
    if profundidade > max_depth {
        return nodes;
    }

    if let Ok(entries) = fs::read_dir(diretorio) {
        for entry in entries.filter_map(Result::ok) {
            let caminho = entry.path();
            let nome = entry.file_name().into_string().unwrap_or_default();

            if caminho.is_dir() {
                // Chama recursivamente para subpastas
                let subpastas = list_files_recursive(&caminho, profundidade + 1, max_depth);
                nodes.push(FileNode {
                    nome: nome.clone(),
                    tipo: "directory".to_string(),
                    caminho: caminho.to_string_lossy().to_string(),
                    conteudo: Some(subpastas),
                });
            } else {
                nodes.push(FileNode {
                    nome: nome.clone(),
                    tipo: "file".to_string(),
                    caminho: caminho.to_string_lossy().to_string(),
                    conteudo: None,
                });
            }
        }
    }

    nodes
}

// Função pública para listar arquivos e pastas, chamando a função recursiva com profundidade inicial 0
#[tauri::command]
pub fn list_files(diretorio: &Path, profundidade: usize) -> Vec<FileNode> {
    list_files_recursive(diretorio, 0, profundidade)
}

// Função para abrir no explorador de arquivos do sistema
#[tauri::command]
pub fn open_in_explorer(path: &str) -> Result<(), String> {
    let output = Command::new("explorer")
        .arg(path)
        .output()
        .map_err(|e| format!("Erro ao abrir o explorador: {}", e))?;

    if !output.status.success() {
        return Err("Falha ao abrir o explorador.".to_string());
    }

    Ok(())
}

// Função para buscar arquivos ou pastas pelo nome
#[tauri::command]
pub fn search_files(diretorio: &Path, termo: &str) -> Vec<FileNode> {
    let mut nodes = Vec::new();

    if let Ok(entries) = fs::read_dir(diretorio) {
        for entry in entries.filter_map(Result::ok) {
            let caminho = entry.path();
            let nome = entry.file_name().into_string().unwrap_or_default();

            // Verifica se o nome do item contém o termo de pesquisa
            if nome.to_lowercase().contains(&termo.to_lowercase()) {
                if caminho.is_dir() {
                    nodes.push(FileNode {
                        nome: nome.clone(),
                        tipo: "directory".to_string(),
                        caminho: caminho.to_string_lossy().to_string(),
                        conteudo: None,
                    });
                } else {
                    nodes.push(FileNode {
                        nome: nome.clone(),
                        tipo: "file".to_string(),
                        caminho: caminho.to_string_lossy().to_string(),
                        conteudo: None,
                    });
                }
            }

            // Se for uma pasta, chama a função recursiva para buscar dentro dela
            if caminho.is_dir() {
                let sub_nodes = search_files(&caminho, termo);
                nodes.extend(sub_nodes);
            }
        }
    }

    nodes
}
