"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaQuestionCircle, FaCog, FaSun, FaMoon } from "react-icons/fa"; // Importa ícones

const navLinks = [
    { title: "Ajuda", path: "/ajuda", icon: <FaQuestionCircle /> },
    { title: "Configuração", path: "/configuracao", icon: <FaCog /> },
];

const Navbar = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null); // Começa com null

    // Carregar a preferência de tema do sistema e do usuário
    useEffect(() => {
        // Verificar a preferência do sistema, se não houver preferência salva no localStorage
        const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Tentar carregar o tema salvo no localStorage
        const savedTheme = localStorage.getItem("theme");

        // Se o usuário tem uma preferência salva, usa ela
        if (savedTheme === "dark") {
            setIsDarkMode(true);
        } else if (savedTheme === "light") {
            setIsDarkMode(false);
        } else {
            // Caso contrário, utiliza a preferência do sistema
            setIsDarkMode(systemPreference);
        }
    }, []); // Carrega apenas na primeira renderização

    // Muda o tema e salva na localStorage
    const toggleTheme = () => {
        const newTheme = !isDarkMode ? "dark" : "light"; // Alterna entre dark e light
        setIsDarkMode((prev) => !prev); // Atualiza o estado
        localStorage.setItem("theme", newTheme); // Salva a preferência no localStorage
    };

    // Garanta que a classe seja aplicada quando o tema estiver carregado
    useEffect(() => {
        if (isDarkMode === null) return; // Evita erro se o estado não estiver pronto
        document.body.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]); // Aplica a classe 'dark' sempre que o estado mudar

    // Se o tema não foi carregado ainda, não exibe a navbar (ou exibe algo de carregamento)
    if (isDarkMode === null) return <div>Carregando...</div>; // Exibe "Carregando..." até o tema ser carregado

    return (
        <nav className="navbar fixed mx-auto top-0 left-0 right-0 z-10">
            <div className="flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2">
                <Link
                    href={"/"}
                    className="text-2xl md:text-5xl font-semibold"
                >
                    Menu
                </Link>
                <div className="flex ml-auto items-center space-x-4">
                    {navLinks.map((link, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <Link href={link.path} className="flex items-center space-x-2">
                                {link.icon}
                                <span className="text-xl">{link.title}</span>
                            </Link>
                        </li>
                    ))}
                    {/* Ícone de alternância de tema */}
                    <button onClick={toggleTheme} className="text-xl">
                        {isDarkMode ? <FaSun /> : <FaMoon />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
