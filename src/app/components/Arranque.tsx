"use client";
import React, { useState } from "react";
import GoBackButton from "./GoBackButton";

const ArranqueCalculator: React.FC = () => {
  const [alturaViga, setAlturaViga] = useState<number>(0);
  const [dobra, setDobra] = useState<number>(0);
  const [entrepiso, setEntrepiso] = useState<number>(0);
  const [fiadaInput, setFiadaInput] = useState<number>(0);
  const [transpasse1, setTranspasse1] = useState<number>(0);
  const [transpasse2, setTranspasse2] = useState<number>(0);
  const [transpasse3, setTranspasse3] = useState<number>(0);
  const [resultados, setResultados] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const calcular = () => {
    if (
      alturaViga <= 0 ||
      entrepiso <= 0
    ) {
      alert("Por favor, preencha todos os campos obrigatórios com valores válidos.");
      return;
    }

    const fiadaIntermediaria = fiadaInput * 20;
    const ferroEmbutido = alturaViga - 5;
    const arranque = ferroEmbutido + dobra + transpasse1;
    const ferro1 = fiadaIntermediaria + transpasse2;
    const ferro2 = (entrepiso - fiadaIntermediaria) + transpasse3;
    const comprimentoTotal = arranque + ferro1 + ferro2;

    setResultados({
      fiadaIntermediaria,
      ferroEmbutido,
      arranque,
      ferro1,
      ferro2,
      comprimentoTotal,
    });

    setIsModalOpen(true);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-8">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-8">
        <h3 className="text-2xl font-semibold text-center text-black mb-6">
          Cálculo de Arranque
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-black">Altura da Viga (cm):</label>
            <input
              type="number"
              value={alturaViga}
              onChange={(e) => setAlturaViga(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div>
            <label className="block font-medium text-black">Dobra do Arranque (cm):</label>
            <input
              type="number"
              value={dobra}
              onChange={(e) => setDobra(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div>
            <label className="block font-medium text-black">Entrepiso (cm):</label>
            <input
              type="number"
              value={entrepiso}
              onChange={(e) => setEntrepiso(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div>
            <label className="block font-medium text-black">Fiada Intermediária (quantidade):</label>
            <input
              type="number"
              value={fiadaInput}
              onChange={(e) => setFiadaInput(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div>
            <label className="block font-medium text-black">1º Transpasse (cm):</label>
            <input
              type="number"
              value={transpasse1}
              onChange={(e) => setTranspasse1(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div>
            <label className="block font-medium text-black">2º Transpasse (cm):</label>
            <input
              type="number"
              value={transpasse2}
              onChange={(e) => setTranspasse2(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div>
            <label className="block font-medium text-black">3º Transpasse (cm):</label>
            <input
              type="number"
              value={transpasse3}
              onChange={(e) => setTranspasse3(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={calcular}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Calcular
          </button>
        </div>

        <GoBackButton />

        {isModalOpen && resultados && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg">
              <h4 className="text-xl font-semibold mb-4 text-center">Resultados</h4>
              <ul className="text-gray-800 space-y-1 text-sm">
                <li><strong>Ferro Embutido:</strong> {resultados.ferroEmbutido} cm</li>
                <li><strong>Fiada Intermediária:</strong> {resultados.fiadaIntermediaria} cm</li>
                <li><strong>Arranque:</strong> {resultados.arranque} cm</li>
                <li><strong>Ferro 1:</strong> {resultados.ferro1} cm</li>
                <li><strong>Ferro 2:</strong> {resultados.ferro2} cm</li>
                <li><strong>Comprimento Total do Ferro:</strong> {resultados.comprimentoTotal} cm</li>
              </ul>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArranqueCalculator;
