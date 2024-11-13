"use client";
import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core"; // Certifique-se de importar corretamente

const RenameStagesApp: React.FC = () => {
  const [renameMsg, setRenameMsg] = useState(""); // Estado para mensagem de renomeação
  const [directory, setDirectory] = useState(""); // Estado para armazenar o diretório
  const [selectedSiglaAntiga, setSelectedSiglaAntiga] = useState<string>(""); // Estado para a sigla antiga
  const [selectedSiglaNova, setSelectedSiglaNova] = useState<string>(""); // Estado para a sigla nova

  const siglas = ["EP", "AP", "PE", "EX", "LO"]; // Lista de siglas disponíveis

  // Função para chamar o comando de renomeação de arquivos
  async function renameFiles() {
    if (!directory) {
      setRenameMsg("Por favor, insira um diretório.");
      return;
    }

    if (!selectedSiglaAntiga || !selectedSiglaNova) {
      setRenameMsg("Por favor, selecione a sigla antiga e a nova.");
      return;
    }

    // Verificando os valores antes de enviar para o backend
    console.log("Sigla Antiga:", selectedSiglaAntiga); 
    console.log("Sigla Nova:", selectedSiglaNova);
    
    try {
      const result = await invoke<string>("renomear_fases", {
        diretorio: directory,
        sigla_antiga: selectedSiglaAntiga, // Usando 'sigla_antiga' como chave
        sigla_nova: selectedSiglaNova,
      });
      setRenameMsg(result); // Define o conteúdo para a mensagem de renomeação
    } catch (error) {
      setRenameMsg("Erro ao renomear arquivos: " + (error instanceof Error ? error.message : String(error)));
    }
  }

  return (
    <div className="items-center justify-center bg-gray-100 p-8">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8">
        <h3 className="text-2xl font-semibold text-center text-black mb-6">Renomear Fases</h3>

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

        <div className="mb-4">
          <label htmlFor="sigla-antiga" className="block text-lg font-medium text-gray-900">
            Sigla Antiga:
          </label>
          <select
            id="sigla-antiga"
            value={selectedSiglaAntiga}
            onChange={(e) => setSelectedSiglaAntiga(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma sigla antiga</option>
            {siglas.map((sigla) => (
              <option key={sigla} value={sigla}>
                {sigla}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="sigla-nova" className="block text-lg font-medium text-gray-700">
            Sigla Nova:
          </label>
          <select
            id="sigla-nova"
            value={selectedSiglaNova}
            onChange={(e) => setSelectedSiglaNova(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma nova sigla</option>
            {siglas.map((sigla) => (
              <option key={sigla} value={sigla}>
                {sigla}
              </option>
            ))}
          </select>
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

export default RenameStagesApp;
