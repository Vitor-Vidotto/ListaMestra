"use client";
import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core"; // Certifique-se de importar corretamente
import { open } from "@tauri-apps/plugin-dialog";
import GoBackButton from "./GoBackButton";
import DirectoryInput from "./DirectoryInput";

const RenameFinalApp: React.FC = () => {
  const [renameMsg, setRenameMsg] = useState(""); // Estado para mensagem de renomeação
  const [directory, setDirectory] = useState(""); // Estado para armazenar o diretório
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]); // Estado para armazenar as extensões selecionadas

  const extensions = ["pdf", "dwg", "png", "jpeg", "jpg", "docx", "xlsx"]; // Lista de extensões disponíveis

  // Função para chamar o comando de renomeação de arquivos
  async function renameFinal() {
    if (!directory) {
      setRenameMsg("Por favor, insira um diretório.");
      return;
    }

    if (selectedExtensions.length === 0) {
      setRenameMsg("Por favor, selecione ao menos uma extensão.");
      return;
    }

    try {
      const result = await invoke<string>("rename_final_dir", {
        directory,
        extensions: selectedExtensions,
      });
      setRenameMsg(result); // Define o conteúdo para a mensagem de renomeação
    } catch (error) {
      setRenameMsg("Erro ao renomear arquivos: " + (error instanceof Error ? error.message : String(error)));
    }
  }
  async function goBack() {
    window.history.back()
  }
  const selectDirectory = async () => {
    try {
      const dir = await open({ multiple: false, directory: true }); // Definindo 'directory' como true para permitir a seleção de pastas
      if (dir) {
        setDirectory(dir as string); // Definindo o diretório selecionado no estado
      }
    } catch (error) {
      setRenameMsg("Erro ao abrir o seletor de diretórios: " + (error instanceof Error ? error.message : String(error)));
    }
  };
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
        <h3 className="text-2xl font-semibold text-center text-black mb-6">Renomear Final</h3>
        
        <DirectoryInput
        directory={directory}
        setDirectory={setDirectory}
        selectDirectory={selectDirectory}
        label="Escolha o Diretório"
        placeholder="Caminho..."
        buttonText="..."
      />
        
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Selecione as Extensões para Renomear:</h4>
          <div className="grid grid-cols-2 gap-4">
            {extensions.map((ext) => (
              <label key={ext} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={ext}
                  onChange={() => handleExtensionChange(ext)}
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-gray-900 capitalize">{ext.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <button
            onClick={renameFinal}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Renomear Arquivos
          </button>
        </div>

        <div className="mt-4 text-center">
          {renameMsg && <p className="text-gray-900">{renameMsg}</p>}
        </div>
        <GoBackButton />
      </div>
    </div>
  );
};

export default RenameFinalApp;
