import { UUID } from "crypto";
import { ReactNode } from "react";

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
  id: UUID;
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

export type QuizOrder = "random" | "in_order";

export type ContentToGenerate =
  | "swedish_to_definition"
  | "definition_to_swedish"
  | "singular_indefinite_to_singular_indefinite"
  | "singular_indefinite_to_plural_indefinite"
  | "singular_definite_to_plural_definite"
  | "plural_indefinite_to_plural_indefinite"
  | "dictionary_form_to_present_tense"
  | "dictionary_form_to_past_tense"
  | "dictionary_form_to_perfect_tense"
  | "present_tense_to_dictionary_form";

export interface QuizCard {
  id: UUID;
  termListId: UUID;
  termId: UUID;
  contentToGenerate?: ContentToGenerate;
}

export type CardSide = "front" | "back";

export type QuizCardContentTemplateData = { [key in CardSide]: string };

export type QuizCardContent = { [key in CardSide]: ReactNode };

export interface Quiz {
  id: UUID;
  cards: QuizCard[];
  name: string;
  order: QuizOrder;
  createdOn: Date;
  updatedOn?: Date;
}

export type TermListObject = {
  [termListId: UUID]: Term[];
};

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
