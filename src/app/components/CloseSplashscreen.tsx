"use client";

import { useEffect } from "react";

const CloseSplashscreen = () => {
  useEffect(() => {
    // Após o carregamento completo do front-end, invocar o comando para fechar a splashscreen
    if (typeof window !== "undefined" && window.__TAURI__) {
      window.__TAURI__.invoke("close_splashscreen");
    }
  }, []); // O array vazio [] garante que isso seja chamado apenas uma vez, quando o componente for montado

  return null; // Não precisa renderizar nada no DOM
};

export default CloseSplashscreen;
