"use client";

const Indisponivel = () => {
  return (
    <div className="w-full flex flex-col items-center min-h-screen">
        {/* Engrenagem animada */}

        <nav className="w-full text-center p-8 bg-white shadow-md rounded-lg max-w-2xl">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Lista Mestra</h1>
          <p className="bg-blue-400 text-white rounded-xl p-6 border-blue-600 border-l-4 shadow-sm">
            Estamos trabalhando nisso ainda, por isso a página segue
            indisponível. Por favor, retorne ao menu.
          </p>
        </nav>
        <br />
        <div className="animate-spin-slow mb-8">
          <img
            src="images/gear.svg"
            alt="Engrenagem girando"
            className="h-20 w-20"
          />
        </div>
      </div>
  );
};

export default Indisponivel;
