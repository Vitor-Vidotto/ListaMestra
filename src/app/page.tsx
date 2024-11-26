"use client"
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import Image from "next/image";
import App from "./components/App";
import Navbar from "./components/NavBar";

export default function Home() {
  useEffect(() => {
    // Função para fechar a splashscreen após 3 segundos
    const closeSplashScreen = async () => {
      try {
        await invoke("close_splashscreen");
      } catch (error) {
        console.error("Erro ao invocar close_splashscreen:", error);
      }
    };

    // Aguardando 3 segundos antes de fechar a splashscreen
    setTimeout(() => {
      closeSplashScreen();
    }, 3200); // 3200 milissegundos = 3,2 segundos

  }, []); // O hook será executado uma vez após o carregamento da página

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <main className="flex flex-col gap-8 items-center sm:items-start">
      <Navbar />
      <div>
      <App />
      </div>
      </main>
    </div>
  );
}
