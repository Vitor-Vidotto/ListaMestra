"use client";
import Link from "next/link";
import React, { useState } from "react";

const appLinks = [
  { title: "Renomeador de Fase", path: "/renomeadores/stages", imageUrl: "/images/simuladores.png" },
  { title: "Renomeador Numérico", path: "/renomeadores/files", imageUrl: "/images/simuladores.png" },
  { title: "Removedor de Final", path: "/renomeadores/final", imageUrl: "/images/simuladores.png" },
  { title: "Removedor de Descrição", path: "/renomeadores/descricao", imageUrl: "/images/simuladores.png" },
];

const RenameLinkGrid = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full text-center p-8">
      <h1 className="text-3xl font-bold mb-4">Renomeadores</h1>
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



export default RenameLinkGrid;
