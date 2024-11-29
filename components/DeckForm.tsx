import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import FloatingLabelInput from "@/components/FloatingLabelInput";

interface DeckFormProps {
  onSubmit: (deckName: string, deckAmount: number) => void;
  isLoading: boolean;
}

export function DeckForm({ onSubmit, isLoading }: DeckFormProps) {
  const [deckName, setDeckName] = useState<string>("");
  const [deckAmount, setDeckAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(deckName, deckAmount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FloatingLabelInput 
        value={deckName} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeckName(e.target.value)} 
        label="Deck Name" 
        id="deckName" 
        className="w-full"
        required
      />
      <input 
        type="number" 
        value={deckAmount.toString()} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeckAmount(parseInt(e.target.value))} 
        
        id="deckAmount" 
        className="w-full bg-[#282831] text-white p-4 rounded-lg"
        required
        min="1"
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate"}
      </Button>
    </form>
  );
}

