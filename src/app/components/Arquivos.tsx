"use client";
import Link from "next/link";
import React, { useState } from "react";

const appLinks = [
  { title: "Listar Arquivos", path: "/arquivos/list", imageUrl: "/images/simuladores.png" },
  { title: "Navegador", path: "/arquivos/navigator", imageUrl: "/images/simuladores.png" },
  { title: "Extrator", path: "/arquivos/extrair", imageUrl: "/images/simuladores.png" },
  { title: "Txt", path: "/arquivos/txt", imageUrl: "/images/simuladores.png" },
];

const FilesLinkGrid = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full text-center p-8">
      <h1 className="text-3xl font-bold mb-4">Arquivos</h1>
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
  );
};



export default FilesLinkGrid;
