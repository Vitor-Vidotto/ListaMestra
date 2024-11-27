use std::fs::{self, DirEntry};
use std::path::{Path, PathBuf};
use std::process::Command;

// Estrutura que representa um arquivo ou diretório
#[derive(Debug, Clone, serde::Serialize)]
pub struct FileNode {
    pub nome: String,
    pub tipo: String, // "file" ou "directory"
    pub caminho: String, // Caminho completo do arquivo/pasta
    pub conteudo: Option<Vec<FileNode>>, // Conteúdo das subpastas (se for um diretório)
}

// Função recursiva para listar arquivos e pastas em um diretório com profundidade limitada
fn list_files_recursive(diretorio: &Path, profundidade: usize) -> Vec<FileNode> {
    let mut nodes = Vec::new();

    // Limita a profundidade da busca a 2 subpastas
    if profundidade > 2 {
        return nodes;
    }

    if let Ok(entries) = fs::read_dir(diretorio) {
        for entry in entries.filter_map(Result::ok) {
            let caminho = entry.path();
            let nome = entry.file_name().into_string().unwrap_or_default();

            if caminho.is_dir() {
                // Chama recursivamente para subpastas
                let subpastas = list_files_recursive(&caminho, profundidade + 1);
                nodes.push(FileNode {
                    nome,
                    tipo: "directory".to_string(),
                    caminho: caminho.to_string_lossy().to_string(),
                    conteudo: Some(subpastas),
                });
            } else {
                nodes.push(FileNode {
                    nome,
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
pub fn list_files(diretorio: &Path) -> Vec<FileNode> {
    list_files_recursive(diretorio, 0)
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
