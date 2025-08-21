"use client";
import Link from "next/link";
import React, { useState } from "react";

const appLinks = [
  { title: "Calculo de Arranque", path: "/calculos/arranque", imageUrl: "/images/simuladores.png" },
  { title: "Indisponível", path: "/indisponivel", imageUrl: "/images/simuladores.png" },
  { title: "Indisponível", path: "/indisponivel", imageUrl: "/images/simuladores.png" },
  { title: "Indisponível", path: "/indisponivel", imageUrl: "/images/simuladores.png" },
];

const CalcLinkGrid = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full text-center p-8">
      <h1 className="text-3xl font-bold mb-4">Calculos</h1>
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



export default CalcLinkGrid;
