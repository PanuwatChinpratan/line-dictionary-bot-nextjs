export interface DictionaryDefinition {
  definition: string;
  synonyms?: string[];
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms?: string[];
}

export interface DictionaryEntry {
  meanings: DictionaryMeaning[];
}

export type ParsedDefinition = {
  definition: string;
  synonyms?: string[];
};

export interface ParsedResult {
  noun?: ParsedDefinition;
  verb?: ParsedDefinition;
}

export function parseEntries(data: unknown): ParsedResult {
  const entries = Array.isArray(data) ? (data as DictionaryEntry[]) : [];
  const entry = entries[0];
  const result: ParsedResult = {};

  const nounMeaning = entry?.meanings?.find((m) => m.partOfSpeech === "noun");
  const nounDef = nounMeaning?.definitions?.[0];
  if (nounDef?.definition) {
    const synonyms = Array.from(
      new Set([...(nounMeaning?.synonyms ?? []), ...(nounDef.synonyms ?? [])])
    );
    result.noun = { definition: nounDef.definition, synonyms };
  }

  const verbMeaning = entry?.meanings?.find((m) => m.partOfSpeech === "verb");
  const verbDef = verbMeaning?.definitions?.[0];
  if (verbDef?.definition) {
    const synonyms = Array.from(
      new Set([...(verbMeaning?.synonyms ?? []), ...(verbDef.synonyms ?? [])])
    );
    result.verb = { definition: verbDef.definition, synonyms };
  }

  return result;
}

export async function fetchDictionary(word: string): Promise<ParsedResult> {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Dictionary request failed: ${res.status}`);
  }
  const json = await res.json();
  return parseEntries(json);
}

export function formatResult(word: string, result: ParsedResult): string {
  const lines: string[] = [];
  if (result.noun) {
    lines.push(`■ Noun: ${result.noun.definition}`);
    if (result.noun.synonyms && result.noun.synonyms.length > 0) {
      lines.push(`Synonyms: ${result.noun.synonyms.slice(0, 5).join(", ")}`);
    }
  }
  if (result.verb) {
    lines.push(`■ Verb: ${result.verb.definition}`);
    if (result.verb.synonyms && result.verb.synonyms.length > 0) {
      lines.push(`Synonyms: ${result.verb.synonyms.slice(0, 5).join(", ")}`);
    }
  }
  if (lines.length === 0) {
    lines.push(`Sorry, I couldn't find a noun/verb definition for "${word}".`);
  }
  return lines.join("\n");
}

