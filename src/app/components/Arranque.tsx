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
  const [espessuraLaje, setEspessuraLaje] = useState<number>(0);
  const [tipoBloco, setTipoBloco] = useState<string>("14x19x29");
  const [desperdicio, setDesperdicio] = useState<number>(0);

  // Quantidade de grautes por bitola
  const [quantidades, setQuantidades] = useState<{ [key: string]: number }>({
    "0": 0,
    "10.0": 0,
    "12.5": 0,
    "16.0": 0,
  });

  const [resultadosTabela, setResultadosTabela] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fatoresPeso: { [key: string]: number } = {
    "10.0": 0.617,
    "12.5": 0.963,
    "16.0": 1.578,
  };

  const secoesFuro: { [key: string]: number } = {
    "14x19x29": 0.09 * 0.09,
    "19x19x39": 0.14 * 0.14,
  };

  const calcular = () => {
    if (alturaViga <= 0 || entrepiso <= 0) {
      alert("Preencha todos os campos obrigatórios com valores válidos.");
      return;
    }

    const fiadaIntermediaria = fiadaInput * 20;
    const ferroEmbutido = alturaViga - 5;
    const arranque = ferroEmbutido + dobra + transpasse1;
    const ferro1 = fiadaIntermediaria + transpasse2;
    const ferro2 = entrepiso - fiadaIntermediaria + transpasse3;
    const comprimentoTotal = arranque + ferro1 + ferro2;
    const comprimentoEmMetros = comprimentoTotal / 100;

    const espessuraEmMetros = espessuraLaje / 100;
    const entrepisoEmMetros = entrepiso / 100;
    const alturaUtil = entrepisoEmMetros - espessuraEmMetros;

    const secaoFuro = secoesFuro[tipoBloco];
    const volumeGrauteUnitario = alturaUtil * secaoFuro;

    let tabela: any[] = [];
    let volumeTotal = 0;

    Object.entries(quantidades).forEach(([bitola, qtd]) => {
      if (qtd > 0) {
        let pesoFinal: string | number = "/";
        if (bitola !== "0") {
          const pesoBase = comprimentoEmMetros * fatoresPeso[bitola];
          pesoFinal = (pesoBase * qtd * (1 + desperdicio / 100)).toFixed(2);
        }
        const volumeTotalBitola = volumeGrauteUnitario * qtd;
        volumeTotal += volumeTotalBitola;

        tabela.push({
          bitola,
          quantidade: qtd,
          comprimentoTotal: (comprimentoEmMetros * qtd).toFixed(2),
          pesoTotal: pesoFinal,
          volumeGraute: volumeTotalBitola.toFixed(2),
        });
      }
    });

    tabela.push({
      bitola: "TOTAL",
      quantidade: "",
      comprimentoTotal: "",
      pesoTotal: "",
      volumeGraute: volumeTotal.toFixed(2),
    });

    setResultadosTabela(tabela);
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
            <label className="block font-medium text-black">Fiada Intermediária (qtd):</label>
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
          <div>
            <label className="block font-medium text-black">Porcentagem de Perda(%):</label>
            <input
              type="number"
              value={desperdicio}
              onChange={(e) => setDesperdicio(Number(e.target.value))}
              min={0}
              max={100}
              className="w-full p-2 border rounded text-black"
            />
          </div>
          <div>
            <label className="block font-medium text-black">Espessura da Laje (cm):</label>
            <input
              type="number"
              value={espessuraLaje}
              onChange={(e) => setEspessuraLaje(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
            />
          </div>
          <div>
            <label className="block font-medium text-black">Tipo de Bloco:</label>
            <select
              value={tipoBloco}
              onChange={(e) => setTipoBloco(e.target.value)}
              className="w-full p-2 border rounded text-black"
            >
              <option value="14x19x29">14x19x29</option>
              <option value="19x19x39">19x19x39</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold text-black mb-2">Quantidade de Grautes por Bitola</h4>
          {Object.keys(quantidades).map((bitola) => (
            <div key={bitola} className="mb-2">
              <label className="block font-medium text-black">
                Bitola {bitola} mm:
              </label>
              <input
                type="number"
                value={quantidades[bitola]}
                onChange={(e) =>
                  setQuantidades({ ...quantidades, [bitola]: Number(e.target.value) })
                }
                className="w-full p-2 border rounded text-black"
              />
            </div>
          ))}
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-lg overflow-x-auto">
              <h4 className="text-xl font-semibold mb-4 text-center">Tabela Final</h4>
              <table className="w-full border-collapse border border-gray-400 text-sm">
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-2 py-1">Bitola (mm)</th>
                    <th className="border border-gray-400 px-2 py-1">Quantidade</th>
                    <th className="border border-gray-400 px-2 py-1">Comprimento Total (m)</th>
                    <th className="border border-gray-400 px-2 py-1">Peso Total + Perda(Kg)</th>
                    <th className="border border-gray-400 px-2 py-1">Volume Graute (m³)</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadosTabela.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-gray-400 px-2 py-1">{row.bitola}</td>
                      <td className="border border-gray-400 px-2 py-1">{row.quantidade}</td>
                      <td className="border border-gray-400 px-2 py-1">{row.comprimentoTotal}</td>
                      <td className="border border-gray-400 px-2 py-1">{row.pesoTotal}</td>
                      <td className="border border-gray-400 px-2 py-1">{row.volumeGraute}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
