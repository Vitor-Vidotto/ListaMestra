"use client";
import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import GoBackButton from "./GoBackButton";

interface FileDetails {
  name: string;
  extension: string | null;
  size: number;
  created_at: string | null;
  modified_at: string | null;
}

const ListFilesApp: React.FC = () => {
  const [directory, setDirectory] = useState("");
  const [extensions, setExtensions] = useState<string>(""); // Mudado para string para facilitar entrada de extensões separadas por vírgula
  const [files, setFiles] = useState<FileDetails[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]); // Seleção das extensões

  const extensionsList = ["pdf", "dwg", "docx", "xlsx", "pptx", "txt", "jpg", "png"];

  // Função para alternar seleção das extensões
  const toggleExtension = (extension: string) => {
    setSelectedExtensions((prev) =>
      prev.includes(extension)
        ? prev.filter((ext) => ext !== extension) // Remove se já está selecionada
        : [...prev, extension] // Adiciona se não está selecionada
    );
  };

  const selectDirectory = async () => {
    try {
      const dir = await open({ directory: true });
      if (dir) setDirectory(dir as string);
    } catch (error) {
      setErrorMessage(
        "Erro ao abrir o seletor de diretórios: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const listFiles = async () => {
    if (!directory) {
      setErrorMessage("Por favor, selecione um diretório.");
      return;
    }

    try {
      const parsedExtensions = selectedExtensions.length
        ? selectedExtensions
        : null;

      const fileData: FileDetails[] = await invoke("list_files_in_directory", {
        directory,
        extensions: parsedExtensions,
      });

      // Corrigir a extensão dos arquivos
      const correctedFiles = fileData.map((file) => {
        // Se a extensão for nula, tenta obter do nome do arquivo
        const extension = file.extension ?? file.name.split('.').pop() ?? null;
        return { ...file, extension };
      });

      setFiles(correctedFiles);
      setSuccess(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        "Erro ao listar arquivos: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };


// Função para salvar os arquivos em formato TXT
async function saveToFile() {
  try {
    // Adiciona os cabeçalhos no início
    const header = "Nome\tExtensão\tTamanho\tCriado em\tModificado em";

    // Gera o conteúdo com os arquivos listados
    const content = files.map((file) => {
      // Remove a extensão do nome
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, ""); // Remove a última extensão, se houver

      // Retorna o formato da linha com os detalhes do arquivo, separado por tabulação
      return `${nameWithoutExtension}\t${file.extension ?? "N/A"}\t${file.size} bytes\t${file.created_at ?? "N/A"}\t${file.modified_at ?? "N/A"}`;
    });

    // Junta o cabeçalho com o conteúdo, separando por linhas
    const fullContent = [header, ...content].join("\n");

    // Abre o seletor de arquivos para salvar
    const handle = await window.showSaveFilePicker({
      suggestedName: "arquivos_listados.txt", // Nome sugerido para o arquivo
      types: [
        {
          description: "Texto",
          accept: { "text/plain": [".txt"] },
        },
      ],
    });

    // Cria um arquivo com o conteúdo gerado
    const writableStream = await handle.createWritable();

    // Converte a string de conteúdo para um array de bytes
    const textContent = new TextEncoder().encode(fullContent); // Codifica a string como bytes

    // Escreve o conteúdo no arquivo
    await writableStream.write(textContent);
    await writableStream.close(); // Fecha o fluxo de escrita

    alert("Arquivo salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar o arquivo:", error);
    alert("Erro ao salvar o arquivo");
  }
}




  return (
    <div className="flex items-center justify-center bg-gray-100 p-8">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8">
        <h3 className="text-2xl font-semibold text-center text-black mb-6">
          Listar Arquivos
        </h3>

        {/* Campo para selecionar o diretório */}
        <div className="mb-4">
          <label htmlFor="directory-input" className="block text-lg font-medium text-gray-900">
            Caminho do Diretório:
          </label>
          <div className="flex">
            <input
              id="directory-input"
              type="text"
              value={directory}
              onChange={(e) => setDirectory(e.currentTarget.value)}
              placeholder="Digite o caminho do diretório..."
              className="w-full mt-2 p-3 border text-gray-900 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={selectDirectory}
              className="ml-2 px-4 py-2 bg-gray-300 rounded-lg text-black hover:bg-gray-400 focus:outline-none"
            >
              ...
            </button>
          </div>
        </div>

        {/* Campo para selecionar extensões com checkboxes */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-900">
            Filtrar por Extensões:
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {extensionsList.map((ext) => (
              <div key={ext} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`ext-${ext}`}
                  value={ext}
                  checked={selectedExtensions.includes(ext)}
                  onChange={() => toggleExtension(ext)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`ext-${ext}`} className="text-gray-900">
                  .{ext}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Botão para listar arquivos */}
        <div className="flex justify-center mb-4">
          <button
            onClick={listFiles}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Listar Arquivos
          </button>
        </div>

        {success && (
          <div className="text-center">
            <p className="text-green-500 font-medium mb-4">
              Listagem concluída com sucesso!
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-gray-300 rounded-lg text-black hover:bg-gray-400 focus:outline-none"
              >
                Visualizar
              </button>
              <button
                onClick={saveToFile}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Salvar
              </button>
            </div>
          </div>
        )}

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <GoBackButton />

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Detalhes dos Arquivos
              </h4>
              <div className="overflow-y-auto max-h-80">
                <table className="table-auto w-full text-left text-sm text-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Nome</th>
                      <th className="px-4 py-2">Extensão</th>
                      <th className="px-4 py-2">Tamanho</th>
                      <th className="px-4 py-2">Criado em</th>
                      <th className="px-4 py-2">Modificado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{file.name}</td>
                        <td className="px-4 py-2">{file.extension ?? "N/A"}</td>
                        <td className="px-4 py-2">{file.size} bytes</td>
                        <td className="px-4 py-2">{file.created_at ?? "N/A"}</td>
                        <td className="px-4 py-2">{file.modified_at ?? "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg text-black hover:bg-gray-400 focus:outline-none"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListFilesApp;
