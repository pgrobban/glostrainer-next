import { UUID } from "crypto";

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
  id: UUID;
  terms: Term[];
  name: string;
  createdOn: Date;
  updatedOn?: Date;
}

export type QuizMode = "definition_to_english" | "english_to_definition";

export interface TermWithQuizMode {
  term: Term;
  quizModes: QuizMode[];
}

export interface Quiz {
  id: UUID;
  termsWithQuizModes: TermWithQuizMode[];
  name: string;
  order: "random" | "in_order";
  createdOn: Date;
  updatedOn?: Date;
}

export interface Profile {
  termLists: TermList[];
  quizzes: Quiz[];
  activeTermListId: UUID | null;
  lastSave?: Date | null;
}

export interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
}

export type ImportStrategy =
  | "merge_lists_without_overwrite"
  | "merge_lists_with_overwrite"
  | "only_add_new_lists"
  | "clear_and_import";
