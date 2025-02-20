"use client"

import ExcelProcessor from "@/app/components/ExtrairBlocos";
import Navbar from "../../components/NavBar";
import ExtrairBlocos from "@/app/components/ExtrairBlocos";
import ExtrairParedes from "@/app/components/ExtrairParedes";
import ExtrairAberturas from "@/app/components/ExtrairAberturas";
import FileUploader from "@/app/components/FileUploader";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <main className="flex flex-col gap-8 items-center sm:items-start">
      <Navbar />
      <div>
        <FileUploader onFileChange={setFile}/>
        <ExtrairBlocos file={file} />
        <ExtrairParedes file={file} />
        <ExtrairAberturas file={file} />
        
      </div>
      </main>
    </div>
  );
}
