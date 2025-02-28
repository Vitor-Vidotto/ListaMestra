import { useState, ReactNode } from 'react';

type FileUploaderProps = {
  onFileChange: (file: File | null) => void;
  children?: ReactNode; // Torne children opcional
};


export default function FileUploader({ onFileChange, children }: FileUploaderProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileChange(event.target.files[0]);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto">
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
        className="mb-4 border p-2 w-full"
      />
      {children}
    </div>
  );
}
