"use client";
import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core"; // Certifique-se de importar corretamente
import { open } from "@tauri-apps/plugin-dialog"; // Importando o método 'open' do plugin Dialog
import GoBackButton from "./GoBackButton";
import DirectoryInput from "./DirectoryInput";

const RenameStagesApp: React.FC = () => {
  const [renameMsg, setRenameMsg] = useState(""); // Estado para mensagem de renomeação
  const [directory, setDirectory] = useState(""); // Estado para armazenar o diretório
  const [selectedSiglaAntiga, setSelectedSiglaAntiga] = useState<string>(""); // Estado para a sigla antiga
  const [selectedSiglaNova, setSelectedSiglaNova] = useState<string>(""); // Estado para a sigla nova
  const [zerarRevisao, setZerarRevisao] = useState(false); // Novo estado para o checkbox

  const siglas = ["EP", "AP", "PE", "EX", "LO"]; // Lista de siglas disponíveis

  // Função para abrir o seletor de diretórios
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

    try {
      const result = await invoke<string>("renomear_fases", {
        diretorio: directory,
        siglaAntiga: selectedSiglaAntiga, // Usando 'sigla_antiga' como chave
        siglaNova: selectedSiglaNova,
        zerarRevisao, // Passa o valor do checkbox
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

        <DirectoryInput
          directory={directory}
          setDirectory={setDirectory}
          selectDirectory={selectDirectory}
          label="Escolha o Diretório"
          placeholder="Caminho..."
          buttonText="..."
        />

        <div className="mb-4">
          <label htmlFor="sigla-antiga" className="block text-lg font-medium text-gray-900">
            Sigla Antiga:
          </label>
          <select
            id="sigla-antiga"
            value={selectedSiglaAntiga}
            onChange={(e) => setSelectedSiglaAntiga(e.target.value)}
            className="w-full mt-2 p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label htmlFor="sigla-nova" className="block text-lg font-medium text-gray-900">
            Sigla Nova:
          </label>
          <select
            id="sigla-nova"
            value={selectedSiglaNova}
            onChange={(e) => setSelectedSiglaNova(e.target.value)}
            className="w-full mt-2 p-3 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma nova sigla</option>
            {siglas.map((sigla) => (
              <option key={sigla} value={sigla}>
                {sigla}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="zerar-revisao" className="inline-flex items-center text-lg font-medium text-gray-900">
            <input
              id="zerar-revisao"
              type="checkbox"
              checked={zerarRevisao}
              onChange={(e) => setZerarRevisao(e.target.checked)}
              className="mr-2 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            Zerar Revisão?
          </label>
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
        <GoBackButton />
      </div>
    </div>
  );
};

export default RenameStagesApp;
