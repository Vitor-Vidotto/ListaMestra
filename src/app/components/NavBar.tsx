"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaQuestionCircle, FaCog, FaSun, FaMoon } from "react-icons/fa"; // Ícones
import { usePathname } from "next/navigation"; // Para obter a rota atual

const helpMessages: Record<string, string> = {
  "/renomeadores/stages": "Ajuda sobre Renomeadores: Etapas. Aqui você aprenderá como utilizar essa ferramenta.",
  "/renomeadores/files": "Ajuda sobre Renomeadores: Arquivos. Saiba como gerenciar e organizar seus arquivos.",
  "/": "Bem-vindo à página inicial! Explore as opções disponíveis para ajuda.",
};

const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void; message: string }> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-md text-center">
        <h2 className="text-xl text-black font-semibold mb-4">Ajuda</h2>
        <p className="text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null); // Tema
  const [isHelpOpen, setIsHelpOpen] = useState(false); // Controle do modal de ajuda
  const pathname = usePathname(); // Obter a rota atual

  // Carregar a preferência de tema do sistema e do usuário
  useEffect(() => {
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else if (savedTheme === "light") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(systemPreference);
    }
  }, []);

  // Alternar tema
  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode((prev) => !prev);
    localStorage.setItem("theme", newTheme);
  };

  // Aplicar classe do tema
  useEffect(() => {
    if (isDarkMode === null) return;
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  if (isDarkMode === null) return <div>Carregando...</div>;

  return (
    <>
      <nav className="navbar fixed mx-auto top-0 left-0 right-0 z-10">
        <div className="flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2">
          <Link href={"/"} className="text-2xl md:text-5xl font-semibold">
            Menu
          </Link>
          <div className="flex ml-auto items-center space-x-4">
            <li className="flex items-center space-x-2">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center space-x-2 text-xl"
              >
                <FaQuestionCircle />
                <span>Ajuda</span>
              </button>
            </li>
            <li className="flex items-center space-x-2">
              <Link href="/configuracao" className="flex items-center space-x-2">
                <FaCog />
                <span>Configuração</span>
              </Link>
            </li>
            <button onClick={toggleTheme} className="text-xl">
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Modal de ajuda */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        message={helpMessages[pathname] || "Ajuda não disponível para esta rota."}
      />
    </>
  );
};

export default Navbar;
