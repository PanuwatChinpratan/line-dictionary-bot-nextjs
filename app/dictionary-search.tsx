"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { fetchDictionary, formatResult } from "../lib/dictionary";

const wordSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z]+$/, "Please enter an English word");

export default function DictionarySearch() {
  const [input, setInput] = useState("");
  const [word, setWord] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["dictionary", word],
    queryFn: () => fetchDictionary(word!),
    enabled: !!word,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = wordSchema.safeParse(input);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message);
      return;
    }
    setValidationError(null);
    setWord(parsed.data.toLowerCase());
  }

  return (
    <>
      <h1 className="text-2xl font-bold">LINE Dictionary Bot</h1>
      <p>
        Send an English word to the LINE bot to receive noun and verb
        definitions.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="rounded border px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter an English word"
        />
        <button
          type="submit"
          className="rounded bg-blue-500 px-3 py-1 text-white"
        >
          Search
        </button>
      </form>
      {validationError && (
        <p className="text-sm text-red-500">{validationError}</p>
      )}
      {isFetching && <p>Loading...</p>}
      {data && word && (
        <pre className="whitespace-pre-wrap">{formatResult(word, data)}</pre>
      )}
    </>
  );
}
