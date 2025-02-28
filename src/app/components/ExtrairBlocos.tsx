'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useState } from 'react';

type DataRow = {
  Name?: string;
  "Position X"?: number;
  "Position Y"?: number;
  "Position Z"?: number;
  Rotation?: number;
  "Scale X"?: number;
};
type ExcelProcessorProps = {
  file: File | null;
};

export default function ExtrairBlocos({ file }: ExcelProcessorProps)  {
  const [fileName, setFileName] = useState('');

  const processExcelFile = async () => {
    if (!file) {
      alert('Selecione um arquivo primeiro!');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: DataRow[] = XLSX.utils.sheet_to_json(worksheet);

        // Filtrando os dados
        const filteredData = jsonData.filter(row => {
          if (!row.Name || !/Line|AL_Bloco|14X19X44/.test(row.Name.trim())) return false;
          
          const validFields = [row["Position X"], row["Position Y"], row["Position Z"], row.Rotation, row["Scale X"]];
          const filledValues = validFields.filter(value => value !== undefined && value !== null && String(value) !== '');
          return filledValues.length >= 2;
        });

        // Definindo as colunas desejadas
        const desiredColumns = ['Name', 'Position X', 'Position Y', 'Position Z', 'Rotation', 'Scale X'];
        const formattedData = filteredData.map(row => {
          const newRow: any = {};
          desiredColumns.forEach(col => newRow[col] = row[col as keyof DataRow]);
          return newRow;
        });

        if (formattedData.length === 0) {
          alert('Nenhum dado válido encontrado para exportação.');
          return;
        }

        // Convertendo para CSV
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const csvData = XLSX.utils.sheet_to_csv(ws);

        // Salvando o arquivo CSV com o nome escolhido
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);

        alert('Arquivo CSV gerado com sucesso!');
      } catch (error) {
        console.error('Erro ao processar o arquivo:', error);
        alert('Ocorreu um erro ao processar o arquivo. Verifique se o formato está correto.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="text-center">
      <h2 className="text-lg font-bold mb-2">Extrair Blocos</h2>
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="Nome do arquivo"
        className="mb-4 border p-2 w-full text-black"
      />
      <button
        onClick={processExcelFile}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Gerar CSV
      </button>
    </div>
  );
}
