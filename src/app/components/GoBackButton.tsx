"use client";
import React from "react";

const GoBackButton: React.FC = () => {


  async function goBack() {
    window.history.back()
  }

  return (
   
        <button
            onClick={goBack}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Voltar
          </button>
  );
};

export default GoBackButton;
