"use client";

import React from "react";

interface DirectoryInputProps {
  directory: string;
  setDirectory: (value: string) => void;
  selectDirectory: () => void;
  label?: string;
  placeholder?: string;
  buttonText?: string;
}

const DirectoryInput: React.FC<DirectoryInputProps> = ({
  directory,
  setDirectory,
  selectDirectory,
  label = "Caminho do Diretório:",
  placeholder = "Digite o caminho do diretório...",
  buttonText = "...",
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor="directory-input"
        className="block min-w-96 text-lg font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="flex">
        <input
          id="directory-input"
          type="text"
          value={directory}
          onChange={(e) => setDirectory(e.currentTarget.value)}
          placeholder={placeholder}
          className="w-full mt-2 text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={selectDirectory}
          className="ml-2 px-4 py-2 bg-gray-300 rounded-lg text-black hover:bg-gray-400 focus:outline-none"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default DirectoryInput;
