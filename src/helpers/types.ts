export const WordClasses = [
  "Noun",
  "Verb",
  "Adjective",
  "Adverb",
  "Pronoun",
  "Numeral",
  "Conjunction",
  "Preposition",
  "Interjection",
  "Phrase/Other",
] as const;
export type WordClassType = (typeof WordClasses)[number];

export interface Conjugation {
  form: string;
  term: string;
}

export interface Term {
  type: WordClassType;
  swedish: string;
  definition: string;
  conjugations?: Conjugation[];
  notes?: string;
}

export interface TermList {
  terms: Term[];
  name: string;
  createdOn: Date;
  updatedOn?: Date;
}
