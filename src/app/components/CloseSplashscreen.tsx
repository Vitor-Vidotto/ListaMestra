"use client";

import { useEffect } from "react";

const CloseSplashscreen = () => {
  useEffect(() => {
    // Verifica se o código já foi executado durante esta sessão
    const splashscreenClosed = sessionStorage.getItem("splashscreenClosed");

    // Função para aguardar um tempo
    const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

    // Se o código ainda não foi executado, invoca o comando para fechar a splashscreen
    if (!splashscreenClosed && typeof window !== "undefined" && window.__TAURI__) {
      (async () => {
        try {
          // Aguarda 4 segundos antes de fechar a splashscreen
          await delay(4000);

          // Invoca o comando para fechar a splashscreen
          await window.__TAURI__.invoke("close_splashscreen");

          // Marca que a splashscreen foi fechada
          sessionStorage.setItem("splashscreenClosed", "true");
        } catch (error) {
          // Evitar que o erro seja lançado se a splashscreen já tiver sido fechada
          console.log("Splashscreen já foi fechada ou erro desconhecido");
        }
      })();
    } else {
      // Simula que a splashscreen foi fechada
      sessionStorage.setItem("splashscreenClosed", "true");
    }
  }, []); // O array vazio [] garante que isso seja chamado apenas uma vez, quando o componente for montado

  return null; // Não precisa renderizar nada no DOM
};

export default CloseSplashscreen;
