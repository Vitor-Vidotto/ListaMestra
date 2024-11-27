"use client";
import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from "@tauri-apps/plugin-dialog"; 
import DirectoryInput from './DirectoryImput';

interface FileNode {
  nome: string;
  tipo: 'file' | 'directory';
  conteudo?: FileNode[];
  caminho: string;  // Caminho completo do arquivo/pasta
  aberto?: boolean; // Estado de pasta aberta/fechada
}

const FileNavigator: React.FC = () => {
  const [diretorio, setDiretorio] = useState<string>(''); // Caminho do diretório
  const [estruturaArquivos, setEstruturaArquivos] = useState<FileNode[]>([]); // Estrutura de arquivos e pastas
  const [filtro, setFiltro] = useState<string>(''); // Filtro de busca

  // Função para listar arquivos e pastas do diretório
  const listarArquivos = async (diretorio: string) => {
    try {
      console.log('Buscando arquivos para o diretório:', diretorio);
      const arquivos = await invoke('list_files', { diretorio });
      console.log('Arquivos retornados:', arquivos);
      const estrutura: FileNode[] = arquivos.map((item: any) => {
        return {
          nome: item.nome,
          tipo: item.tipo, // 'file' ou 'directory'
          caminho: item.caminho,
          conteudo: item.tipo === 'directory' ? [] : undefined,
          aberto: false, // Inicialmente fechado
        };
      });
      setEstruturaArquivos(estrutura);
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
    }
  };

  // Função para carregar conteúdo de uma pasta
  const carregarConteudoPasta = async (pasta: FileNode) => {
    if (!pasta.conteudo || pasta.conteudo.length === 0) {
      // Se o conteúdo da pasta ainda não foi carregado
      const arquivos = await invoke('list_files', { diretorio: pasta.caminho });
      const conteudo = arquivos.map((item: any) => ({
        nome: item.nome,
        tipo: item.tipo,
        caminho: item.caminho,
        conteudo: item.tipo === 'directory' ? [] : undefined,
        aberto: false, // Inicialmente fechado
      }));
      pasta.conteudo = conteudo;
      setEstruturaArquivos((prevEstrutura) =>
        prevEstrutura.map((item) => (item.caminho === pasta.caminho ? pasta : item))
      );
    }
  };

  // Função para alternar entre abrir e fechar uma pasta
  const togglePasta = (pasta: FileNode) => {
    pasta.aberto = !pasta.aberto;
    setEstruturaArquivos([...estruturaArquivos]);
    if (pasta.aberto) {
      carregarConteudoPasta(pasta); // Carrega o conteúdo da pasta quando for aberta
    }
  };

  // Função para filtrar arquivos e pastas
  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  // Função para buscar arquivos de um diretório específico
  const handleBuscarDiretorio = () => {
    if (diretorio) {
      listarArquivos(diretorio);
    } else {
      alert("Por favor, insira um diretório válido.");
    }
  };

  // Função para abrir o explorador de arquivos
  const abrirNoExplorador = async (caminho: string) => {
    try {
      await invoke('open_in_explorer', { path: caminho });
    } catch (error) {
      console.log("erro")
    }
  };

  // Função recursiva para filtrar arquivos/pastas com base no nome
  const filtrarArquivos = (item: FileNode) => {
    // Verifica se o nome do arquivo ou pasta corresponde ao filtro
    const corresponde = item.nome.toLowerCase().includes(filtro.toLowerCase());

    // Se for uma pasta, verifica recursivamente as subpastas
    if (item.tipo === 'directory' && item.conteudo) {
      // Filtra o conteúdo da pasta
      item.conteudo = item.conteudo.filter(filtrarArquivos);
    }

    // Retorna true se o item ou qualquer subitem dentro dele corresponder ao filtro
    return corresponde || (item.tipo === 'directory' && item.conteudo?.length > 0);
  };

  // Filtra os arquivos com base no nome
  const arquivosFiltrados = estruturaArquivos.filter(filtrarArquivos);

  // Função recursiva para renderizar arquivos e pastas
  const renderizarPasta = (pasta: FileNode) => (
    <div key={pasta.caminho}>
      <div className="flex items-center space-x-2">
        {/* Ícone de pasta */}
        <button
          onClick={() => togglePasta(pasta)}
          className="text-blue-500 cursor-pointer"
        >
          {pasta.tipo === 'directory' ? '📂' : '📄'} {pasta.nome}
        </button>
        {/* Botão para abrir no explorador de arquivos */}
        <button
          onClick={() => abrirNoExplorador(pasta.caminho)}
          className="text-green-500 cursor-pointer ml-2"
        >
          🌍
        </button>
      </div>
      {/* Exibe o conteúdo da pasta se ela estiver aberta */}
      {pasta.tipo === 'directory' && pasta.aberto && pasta.conteudo && (
        <div className="ml-4 space-y-2">
          {pasta.conteudo.map((subItem) => renderizarPasta(subItem))}
        </div>
      )}
    </div>
  );

  const selectDirectory = async () => {
    try {
      const dir = await open({ multiple: false, directory: true }); // Definindo 'directory' como true para permitir a seleção de pastas
      if (dir) {
        setDiretorio(dir as string); // Definindo o diretório selecionado no estado
      }
    } catch (error) {
      console.error("Erro ao abrir o seletor de diretórios:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen space-y-6">
      <div className="flex items-center gap-x-2">
        <DirectoryInput
          directory={diretorio}
          setDirectory={setDiretorio}
          selectDirectory={selectDirectory}
          buttonText="..."
        />
        <button
          onClick={handleBuscarDiretorio}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
        >
          Buscar Diretório
        </button>
      </div>

      <input
        type="text"
        value={filtro}
        onChange={handleFiltroChange}
        placeholder="🔍 Filtrar arquivos..."
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
      />

      {estruturaArquivos.length > 0 && (
        <div className="relative bg-white p-4 rounded-lg shadow-xl border border-gray-300">
          <button
            onClick={() => {
              setEstruturaArquivos([]);
              setFiltro("");
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-all"
          >
            ❌
          </button>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Arquivos e Pastas</h2>
          <div className="max-h-[40vh] overflow-y-auto space-y-2 border-t border-gray-200 pt-2">
            {arquivosFiltrados.map((item) => renderizarPasta(item))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileNavigator;
