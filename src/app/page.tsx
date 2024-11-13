"use client"
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import Image from "next/image";
import App from "./components/App";
import Navbar from "./components/NavBar";
import CloseSplashscreen from "./components/CloseSplashscreen";

export default function Home() {
  useEffect(() => {
    // Invoca a função close_splashscreen quando a página for carregada
    const closeSplashScreen = async () => {
      try {
        await invoke("close_splashscreen");
      } catch (error) {
        console.error("Erro ao invocar close_splashscreen:", error);
      }
    };

    // Aguardando a resposta para fechar a splash screen
    closeSplashScreen();
  }, []); // O hook será executado uma vez após o carregamento da página

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <main className="flex flex-col gap-8 items-center sm:items-start">
      <Navbar />
      <div>
      <App />
      <CloseSplashscreen />
      </div>
      </main>
    </div>
  );
}
