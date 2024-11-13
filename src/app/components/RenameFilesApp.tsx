"use client";
import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core"; // Certifique-se de importar corretamente

const RenameFilesApp: React.FC = () => {
  const [renameMsg, setRenameMsg] = useState(""); // Estado para mensagem de renomeação
  const [directory, setDirectory] = useState(""); // Estado para armazenar o diretório
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]); // Estado para armazenar as extensões selecionadas

  const extensions = ["pdf", "dwg", "png", "jpeg", "jpg", "docx", "xlsx"]; // Lista de extensões disponíveis

  // Função para chamar o comando de renomeação de arquivos
  async function renameFiles() {
    if (!directory) {
      setRenameMsg("Por favor, insira um diretório.");
      return;
    }

    if (selectedExtensions.length === 0) {
      setRenameMsg("Por favor, selecione ao menos uma extensão.");
      return;
    }

    try {
      const result = await invoke<string>("rename_files_in_directory", {
        directory,
        extensions: selectedExtensions,
      });
      setRenameMsg(result); // Define o conteúdo para a mensagem de renomeação
    } catch (error) {
      setRenameMsg("Erro ao renomear arquivos: " + (error instanceof Error ? error.message : String(error)));
    }
  }

  // Função para lidar com a seleção/deseleção de extensões
  const handleExtensionChange = (ext: string) => {
    setSelectedExtensions((prev) => {
      if (prev.includes(ext)) {
        return prev.filter((e) => e !== ext); // Remove a extensão se já estiver selecionada
      } else {
        return [...prev, ext]; // Adiciona a extensão se não estiver selecionada
      }
    });
  };

  return (
    <div className=" items-center justify-center bg-gray-100 p-8">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8">
        <h3 className="text-2xl font-semibold text-center text-black mb-6">Renomear Arquivos</h3>
        
        <div className="mb-4">
          <label htmlFor="directory-input" className="block text-lg font-medium text-gray-700">
            Caminho do Diretório:
          </label>
          <input
            id="directory-input"
            type="text"
            value={directory}
            onChange={(e) => setDirectory(e.currentTarget.value)}
            placeholder="Digite o caminho do diretório..."
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Selecione as Extensões para Renomear:</h4>
          <div className="grid grid-cols-2 gap-4">
            {extensions.map((ext) => (
              <label key={ext} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={ext}
                  onChange={() => handleExtensionChange(ext)}
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-gray-700 capitalize">{ext.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <button
            onClick={renameFiles}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Renomear Arquivos
          </button>
        </div>

        <div className="mt-4 text-center">
          {renameMsg && <p className="text-gray-900">{renameMsg}</p>}
        </div>
      </div>
    </div>
  );
};

export default RenameFilesApp;
