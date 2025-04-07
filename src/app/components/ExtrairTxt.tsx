'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import GoBackButton from './GoBackButton';

const roundUpToMultiple = (value: number, multiple = 5) => {
  return Math.ceil(value / multiple) * multiple;
};

const getFaValue = (fbk: number): string => {
  if (fbk >= 3 && fbk <= 6) return 'AAE5';
  if (fbk >= 8 && fbk <= 10) return 'AAE8';
  if (fbk >= 12 && fbk <= 14) return 'AAE12';
  if (fbk >= 16 && fbk <= 18) return 'AAE16';
  if (fbk >= 20 && fbk <= 22) return 'AAE20';
  if (fbk >= 24 && fbk <= 26) return 'AAEE';
  return '';
};

const ProcessFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('resultado');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const processFile = async () => {
    if (!file) return alert('Selecione um arquivo primeiro.');

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = ['Niv', 'Fbk', 'Fgk', 'Fa', 'Fpk', 'Fpk'];
      const data: any[] = [];
      
      for (let i = 4; i < lines.length - 1; i++) {
        const values = lines[i].trim().split(/\s+/);
        if (values.length >= 9) {
          const fbk = parseFloat(values[1]);
          const fa = getFaValue(fbk);
          const row = [
            '',
            fbk,
            roundUpToMultiple(parseFloat(values[8])),
            fa,
            parseFloat(values[5]),
            parseFloat(values[6]),
          ];
          data.push(row);
        }
      }
      
      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Dados Processados');
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      setSuccessMessage('Arquivo processado e salvo com sucesso!');
    };
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Processador de Arquivo</h1>
      <h1>Nome Do Arquivo</h1>
      <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} className="border p-2 rounded" />
      <input type="file" accept=".txt" onChange={handleFileUpload} />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={processFile}
      >
        Processar Arquivo
      </button>
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      <GoBackButton />
    </div>
  );
};

export default ProcessFile;