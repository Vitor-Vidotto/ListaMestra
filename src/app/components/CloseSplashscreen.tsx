"use client";

import { useEffect } from "react";

const CloseSplashscreen = () => {
  useEffect(() => {
    // Verifica se o código já foi executado durante esta sessão (ou entre recarregamentos)
    const splashscreenClosed = sessionStorage.getItem("splashscreenClosed");

    // Se o código ainda não foi executado, invoca o comando para fechar a splashscreen
    if (!splashscreenClosed && typeof window !== "undefined" && window.__TAURI__) {
      window.__TAURI__.invoke("close_splashscreen")
        .then(() => {
          // Marca que a splashscreen foi fechada
          sessionStorage.setItem("splashscreenClosed", "true");
        })
        .catch(() => {
          // Evitar que o erro seja lançado se a splashscreen já tiver sido fechada
          console.log("Splashscreen já foi fechada ou erro desconhecido");
        });
    } else {
      // Simula que a splashscreen foi fechada
      sessionStorage.setItem("splashscreenClosed", "true");
    }
  }, []); // O array vazio [] garante que isso seja chamado apenas uma vez, quando o componente for montado

  return null; // Não precisa renderizar nada no DOM
};

export default CloseSplashscreen;
