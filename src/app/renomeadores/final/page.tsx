"use client"
import Navbar from "../../components/NavBar";
import RenameFinalApp from "../../components/RenameFinalApp";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center h-screen p-8 pb-20 gap-16 sm:p-20 overflow-hidden">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <Navbar />
        <div className="flex gap-8 bg-white shadow-lg rounded-lg p-4">
          <RenameFinalApp />
        </div>
      </main>
    </div>
  );
}
