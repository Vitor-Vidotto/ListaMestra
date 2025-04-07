import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import GoBackButton from './GoBackButton';

type DataRow = {
  Name?: string;
  'Position X'?: number;
  'Position Y'?: number;
  'Position Z'?: number;
  Rotation?: number;
  Largura_Porta?: number;
  Altura_Porta?: number;
  Largura_Janela?: number;
  Altura_Janela?: number;
  Peitoril_Janela?: number;
};

type ExcelProcessorProps = {
  file: File | null;
};

export default function ExtrairAberturas({ file }: ExcelProcessorProps) {
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

        const desiredColumns = [
          'Name',
          'Position X',
          'Position Y',
          'Position Z',
          'Rotation',
          'Largura_Porta',
          'Altura_Porta',
          'Largura_Janela',
          'Altura_Janela',
          'Peitoril_Janela',
        ];

        const filteredData = jsonData.filter((row) => {
          return row['Name'] && /AL_Porta|AL_Janela/.test(row['Name'].toString());
        });

        const filteredDataWithValidColumns = filteredData.filter((row) => {
          const validFields = [
            row['Position X'],
            row['Position Y'],
            row['Position Z'],
            row['Rotation'],
            row['Largura_Porta'],
            row['Altura_Porta'],
            row['Largura_Janela'],
            row['Altura_Janela'],
            row['Peitoril_Janela'],
          ];
          const filledValues = validFields.filter((value) => value !== undefined && value !== null);
          return filledValues.length >= 2;
        });

        const formattedData = filteredDataWithValidColumns.map((row) => {
          const newRow: any = {};
          desiredColumns.forEach((col) => (newRow[col] = row[col as keyof DataRow]));
          return newRow;
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
      <h2 className="text-lg font-bold mb-2">Extrair Aberturas</h2>
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
      <div className='pt-4'>
      <GoBackButton />
      </div>
    </div>
  );
}
