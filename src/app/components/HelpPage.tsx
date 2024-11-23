"use client";
import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core"; // Certifique-se de importar corretamente
import { open } from "@tauri-apps/plugin-dialog"; // Importando o método 'open' do plugin Dialog
import GoBackButton from "./GoBackButton";
import Link from "next/link";

const appLinks = [
    { title: "Renomeadores", path: "/renomeadores/stages", imageUrl: "/images/simuladores.png" },
    { title: "Arquivos", path: "/renomeadores/files", imageUrl: "/images/simuladores.png" },
  ];
  

const HelpPage: React.FC = () => {
  return (
    <div>
        <div className="w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-4">Ajuda</h1>
      <nav className="w-full text-center p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 mx-auto" style={{ width: '600px'}}>
          {appLinks.map((app, index) => (
            <Link
              key={index}
              href={app.path}
              className="relative block h-40 bg-cover bg-center rounded-lg transition duration-300 ease-in-out hover:scale-105"
              style={{ backgroundImage: `url(${app.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-lg">
                <h2 className="text-white text-2xl font-semibold">{app.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
    </div>
  );
};

export default HelpPage;
