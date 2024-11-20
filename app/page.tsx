"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export default function index() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
