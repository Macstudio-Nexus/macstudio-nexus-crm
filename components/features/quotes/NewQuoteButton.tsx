"use client";
import { useState } from "react";
import NewQuote from "./NewQuote";

export default function NewQuoteButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="form-button"
      >
        Create Quote
      </button>
      {isOpen && <NewQuote onClose={() => setIsOpen(false)} />}
    </>
  );
}
