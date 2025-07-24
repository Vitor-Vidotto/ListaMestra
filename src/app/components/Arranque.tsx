"use client";
import React, { useState } from "react";
import GoBackButton from "./GoBackButton";

const ArranqueCalculator: React.FC = () => {
  const [alturaViga, setAlturaViga] = useState<number>(0);
  const [dobra, setDobra] = useState<number>(0);
  const [diametro, setDiametro] = useState<number>(0);
  const [fiadaIntermediaria, setFiadaIntermediaria] = useState<number>(0);
  const [entrepiso, setEntrepiso] = useState<number>(0);
  const [espessuraLaje, setEspessuraLaje] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [tipoFerro, setTipoFerro] = useState<string>("verde");
  const [resultados, setResultados] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const pesosFerro: Record<string, number> = {
    verde: 0,
    "10mm": 0.617,
    "12.5mm": 0.975,
    "16mm": 1.58,
  };

  const calcular = () => {
    if (
      alturaViga <= 0 ||
      diametro <= 0 ||
      entrepiso <= 0 ||
      espessuraLaje <= 0 ||
      quantidade <= 0
    ) {
      alert("Por favor, preencha todos os campos com valores válidos.");
      return;
    }

    const alturaUtil = alturaViga - 5;
    const barraSuperior = 2 * (50 * diametro) + fiadaIntermediaria * 20;
    const ultimaBarra = 50 * diametro + (entrepiso - fiadaIntermediaria * 20);
    const comprimentoTotalFerro = ((barraSuperior + ultimaBarra) / 100) * quantidade;
    const pesoTotal = pesosFerro[tipoFerro] * comprimentoTotalFerro;

    const grauteVerde = quantidade * (entrepiso - espessuraLaje);
    const volumeGraute = quantidade * 0.09 * 0.09 * (entrepiso - espessuraLaje);
    const grauteFerro = quantidade * comprimentoTotalFerro;

    setResultados({
      alturaUtil,
      barraSuperior,
      ultimaBarra,
      comprimentoTotalFerro,
      pesoTotal,
      grauteVerde,
      volumeGraute,
      grauteFerro,
    });

    setIsModalOpen(true);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 p-8">
      <div className="max-w-5xl w-full bg-white shadow-xl rounded-lg p-8">
        <h3 className="text-2xl font-semibold text-center text-black mb-6">
          Cálculo de Arranque
        </h3>

        {/* Inputs em 3 colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Altura da Viga (cm):</label>
            <input
              type="number"
              value={alturaViga}
              onChange={(e) => setAlturaViga(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Dobra do Arranque (cm):</label>
            <input
              type="number"
              value={dobra}
              onChange={(e) => setDobra(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Diâmetro do Ferro (cm):</label>
            <input
              type="number"
              value={diametro}
              onChange={(e) => setDiametro(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Fiada Intermediária (cm):</label>
            <input
              type="number"
              value={fiadaIntermediaria}
              onChange={(e) => setFiadaIntermediaria(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Entrepiso (cm):</label>
            <input
              type="number"
              value={entrepiso}
              onChange={(e) => setEntrepiso(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Espessura da Laje (cm):</label>
            <input
              type="number"
              value={espessuraLaje}
              onChange={(e) => setEspessuraLaje(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Quantidade:</label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Tipo de ferro */}
          <div className="col-span-full">
            <label className="block font-medium mb-1">Tipo de Ferro:</label>
            <div className="flex flex-wrap gap-4">
              {["verde", "10mm", "12.5mm", "16mm"].map((tipo) => (
                <label key={tipo} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipoFerro"
                    value={tipo}
                    checked={tipoFerro === tipo}
                    onChange={() => setTipoFerro(tipo)}
                  />
                  {tipo === "verde" ? "Verde (0mm)" : tipo}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Botão */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={calcular}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Calcular
          </button>
        </div>

        <GoBackButton />

        {/* Modal de Resultados */}
        {isModalOpen && resultados && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg">
              <h4 className="text-xl font-semibold mb-4 text-center">Resultados</h4>
              <ul className="text-gray-800 space-y-1 text-sm">
                <li><strong>Altura útil:</strong> {resultados.alturaUtil} cm</li>
                <li><strong>Barras Superiores:</strong> {resultados.barraSuperior} cm</li>
                <li><strong>Última Barra:</strong> {resultados.ultimaBarra} cm</li>
                <li><strong>Comprimento Total do Ferro:</strong> {resultados.comprimentoTotalFerro.toFixed(2)} m</li>
                <li><strong>Peso Total:</strong> {resultados.pesoTotal.toFixed(2)} kg</li>
                <li><strong>Graute Verde:</strong> {resultados.grauteVerde} cm</li>
                <li><strong>Volume de Graute:</strong> {resultados.volumeGraute.toFixed(4)} m³</li>
                <li><strong>Graute com Ferro:</strong> {resultados.grauteFerro.toFixed(2)} m</li>
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
