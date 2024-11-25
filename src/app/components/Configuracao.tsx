"use client";
import React, { useState, useEffect, useCallback } from "react";
import { invoke } from '@tauri-apps/api/core';

// Função para salvar o tamanho da janela no localStorage
const saveWindowSize = (size: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("windowSize", size);
  }
};

// Função para carregar o tamanho da janela do localStorage
const loadWindowSize = () => {
  if (typeof window !== "undefined") {
    const savedSize = localStorage.getItem("windowSize");
    return savedSize || 'small'; // Retorna 'small' como valor inicial
  }
  return 'small'; // Retorna 'small' se no lado do servidor
};

const ConfiguracaoPage = () => {
  const [windowSize, setWindowSize] = useState<string>('small'); // Inicialize com valor padrão
  const [pendingSize, setPendingSize] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false); // Se está aguardando confirmação
  const [timer, setTimer] = useState(15); // Timer de 15 segundos
  const [previousSize, setPreviousSize] = useState(windowSize); // Armazena o tamanho anterior

  // Carrega o tamanho da janela após o componente ser montado
  useEffect(() => {
    const savedSize = loadWindowSize();
    setWindowSize(savedSize);
  }, []);

  const applyWindowSize = (size: string) => {
    setPendingSize(size); 
    setPreviousSize(windowSize);
    setConfirming(true);
    setTimer(15);
  };

  // Função para confirmar a mudança de resolução
  const confirmResolutionChange = () => {
    let width = 900, height = 720;

    switch (pendingSize) {
      case 'small':
        width = 900;
        height = 720;
        break;
      case 'medium':
        width = 1024;
        height = 768;
        break;
      case 'large':
        invoke('set_fullscreen')
          .then(() => {
            setWindowSize('large');
            saveWindowSize('large'); // Salva a configuração para 'large'
            setConfirming(false); // Fecha a confirmação
            setPendingSize(null); // Limpa o tamanho pendente
          })
          .catch((error) => {
            console.error("Erro ao alternar para tela cheia:", error);
          });
        return;
      default:
        break;
    }

    // Redimensiona a janela para os tamanhos pequeno ou médio
    invoke('set_window_size', { width, height })
    .then(() => {
      if (pendingSize) {
        setWindowSize(pendingSize); // Apenas usa se não for null
        saveWindowSize(pendingSize); // Salva o novo tamanho
      }
      setConfirming(false); // Fecha a confirmação
      setPendingSize(null); // Limpa o tamanho pendente
    })
    .catch((error) => {
      console.error("Erro ao redimensionar a janela:", error);
    });
  };

  // Função para cancelar a mudança de resolução
  const cancelAlteration = () => {
    setConfirming(false); // Cancela a mudança
    setPendingSize(null); // Limpa o tamanho pendente
    setWindowSize(previousSize); // Restaura o tamanho anterior
    saveWindowSize(previousSize); // Salva o tamanho anterior
  };

  // Função para contar o tempo restante
  useEffect(() => {
    if (confirming && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [confirming, timer]);

  useEffect(() => {
    if (timer === 0 && confirming) {
      cancelAlteration(); // Reverte as alterações após 15 segundos
    }
  }, [timer, confirming]);

  return (
    <div className="w-full flex flex-col items-center p-8">
      <nav className="w-full text-center mb-8">
        <h1 className="text-3xl font-bold">Configuração</h1>
      </nav>
      <div className="w-full flex flex-col items-center mb-8">
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-4">Tamanho da Janela</h2>
          <select
            value={windowSize}
            onChange={(e) => applyWindowSize(e.target.value)}
            className="p-2 border rounded text-gray-900"
          >
            <option value="small">Pequeno (900x720)</option>
            <option value="medium">Médio (1024x768)</option>
            <option value="large">Tela Cheia</option>
          </select>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {confirming && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white text-gray-900 p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-xl mb-4">Confirmar Mudança de Resolução</h3>
            <p>Você tem {timer} segundos para confirmar a mudança.</p>
            <div className="mt-4 flex justify-around">
              <button
                onClick={confirmResolutionChange}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Confirmar
              </button>
              <button
                onClick={cancelAlteration}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={() => alert("Configurações Salvas!")}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default ConfiguracaoPage;
