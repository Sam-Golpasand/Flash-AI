"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { DeckForm } from "@/components/DeckForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Card {
  question: string;
  answer: string;
}

interface ApiResponse {
  cards: Card[];
}

export default function Index() {
  const [files, setFiles] = useState<File[]>([]);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  function handleFileUpload(files: File[]) {
    setFiles(files);
  }

  function handleClear() {
    setFiles([]);
    setResponse(null);
    toast.info("Form cleared");
  }

  async function handleGenerate(deckName: string, deckAmount: number) {
    if (files.length === 0) {
      toast.error("Please upload files first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("deckAmount", deckAmount.toString());

    try {
      const res = await fetch("http://localhost:5000/file-upload", {
        method: "POST",
        body: formData,
      });

      const data: ApiResponse = await res.json();
      setResponse(data);

      console.log("Data:", data);
      if (!data) {
        console.log("No data returned");
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("User not authenticated");
        throw new Error("User not authenticated");
      }

      const { data: deck, error: deckError } = await supabase
        .from("decks")
        .insert([{ title: deckName, user_id: user.id }])
        .select()
        .single();

      if (deckError || !deck) {
        toast.error(deckError?.message || "Failed to create deck");
        throw new Error(deckError?.message || "Failed to create deck");
      }

      const cards = data.cards.map((card) => ({
        deck_id: deck.id,
        question: card.question,
        answer: card.answer,
      }));

      const { error: cardsError } = await supabase.from("cards").insert(cards);

      if (cardsError) {
        toast.error("Failed to create cards");
        throw new Error("Failed to create cards");
      }

      toast.success("Deck and cards created successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center">Create Deck</h1>
        <FileUpload onChange={handleFileUpload} />
        <DeckForm onSubmit={handleGenerate} isLoading={loading} />
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={handleClear} disabled={loading}>
            Clear
          </Button>
        </div>
        {response && (
          <div className="mt-8 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Response:</h3>
            <pre className=" p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
