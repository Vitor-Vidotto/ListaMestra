'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useState } from 'react';

type DataRow = {
  Layer?: string;
  'Start X'?: number;
  'End X'?: number;
  'Start Y'?: number;
  'End Y'?: number;
  Angle?: number;
};

type ExcelProcessorProps = {
  file: File | null;
};

export default function ExtrairEixos({ file }: ExcelProcessorProps) {
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

        // Filtrando os dados com pelo menos 3 valores preenchidos entre os campos analisados
        const filteredData = jsonData.filter((row) => {
          const validFields = [
            row['Start X'],
            row['End X'],
            row['Start Y'],
            row['End Y'],
            row['Angle'],
          ];
          const filledValues = validFields.filter(
            (value) =>
              value !== undefined &&
              value !== null &&
              String(value).trim() !== ''
          );
          return filledValues.length >= 3;
        });

        const desiredColumns = ['Layer', 'Start X', 'End X', 'Start Y', 'End Y', 'Angle'];

        const formattedData = filteredData
          .map((row) => {
            const newRow: any = {};
            desiredColumns.forEach((col) => {
              newRow[col] = row[col as keyof DataRow] ?? '';
            });
            return newRow;
          })
          .filter((row) => {
            // Certificando-se de que pelo menos 3 colunas estão preenchidas na linha formatada
            const filledCount = desiredColumns.filter(col => row[col] !== '').length;
            return filledCount >= 3;
          });

        if (formattedData.length === 0) {
          alert('Nenhum dado válido encontrado para exportação.');
          return;
        }

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const csvData = XLSX.utils.sheet_to_csv(ws);

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
      <h2 className="text-lg font-bold mb-2">Extrair Eixos & Paredes</h2>
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
