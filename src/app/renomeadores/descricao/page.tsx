"use client"
import RenameDesc from "@/app/components/RenameDescApp";
import Navbar from "../../components/NavBar";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center h-screen p-8 pb-20 gap-16 sm:p-20 overflow-hidden">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <Navbar />
        <div className="flex gap-8 bg-white shadow-lg rounded-lg p-4">
          <RenameDesc />
        </div>
      </main>
    </div>
  );
}
