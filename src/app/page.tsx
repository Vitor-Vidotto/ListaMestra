"use client"
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import Image from "next/image";
import App from "./components/App";
import Navbar from "./components/NavBar";

export default function Home() {
  useEffect(() => {
    // Isso vai rodar no lado do cliente, após o carregamento da página
    invoke("close_splashscreen").catch((error) => {
      console.error("Erro ao invocar close_splashscreen:", error);
    });
  }, []); // A dependência vazia [] garante que isso aconteça apenas uma vez após o carregamento.

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <Navbar />
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <App />
      </main>
    </div>
  );
}
